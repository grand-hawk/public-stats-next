local ReplicatedFirst = game:GetService("ReplicatedFirst")
local ServerStorage = game:GetService("ServerStorage")
local InsertService = game:GetService("InsertService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Shells = ReplicatedFirst:WaitForChild("Shells") :: Folder
local Modules = Shells:WaitForChild("Modules") :: Folder
local PHRST = ReplicatedStorage:WaitForChild("PHRST") :: Folder
local Tanks = ServerStorage:WaitForChild("Tanks") :: Folder

local GlobalConstants = require(Shells:WaitForChild("GlobalConstants") :: ModuleScript)
local ShellModules = require(PHRST:WaitForChild("ShellModules") :: ModuleScript)
local TankInfo = require(ReplicatedStorage:WaitForChild("TankInfo") :: ModuleScript)

local vehicleWeaponReference: { [string]: { string } } = {}

for name, tank in TankInfo do
	if tank.Hidden then
		continue
	end

	local model = Tanks:FindFirstChild(name)
	if not model and tank.ModelID then
		local folder = InsertService:LoadAsset(tank.ModelID)

		model = folder:FindFirstAncestorWhichIsA("Model")
	end

	if model then
		local tankName = tank.Dispname

		local turrets = model:FindFirstChild("Turrets") :: Folder?
		if not turrets then
			continue
		end

		for _, turret in turrets:GetChildren() do
			local weapons = turret:FindFirstChild("Weapons") :: Folder?
			if not weapons then
				continue
			end

			for _, weapon in weapons:GetChildren() do
				if not vehicleWeaponReference[tankName] then
					vehicleWeaponReference[tankName] = {}
				end
				if table.find(vehicleWeaponReference[tankName], weapon.Name) then
					continue
				end

				table.insert(vehicleWeaponReference[tankName], weapon.Name)
			end
		end
	end
end

type ShellModule = {
	name: string,
	type: string,
	relatedVehicles: { string },
	mass: number,
	velocity: number,
	damage: number,
	shrapMultiplier: number?,
	ricochetAngle: number?,
	eraTip: number?,

	maxPenetration: number,
	penetrationTable: {
		[number]: {
			[number]: { number | nil },
		},
	},

	explosive: {
		mass: number,
		blastRadiusMultiplier: number?,
		explosiveRadius: number?,
	}?,

	missile: {
		boostTime: number?,
		turnRate: number?,
		limit: number?,
		irccm: boolean?,
		unjammable: boolean,
	}?,

	cluster: {
		submunitions: number,
		dispersion: number,
	}?,
}

local weapons: { [string]: { ShellModule } } = {}

for _, moduleScript in Modules:GetChildren() do
	if not moduleScript:IsA("ModuleScript") then
		continue
	end
	if table.find({ "InfGuns", "Flares", "Smoke Grenade" }, moduleScript.Name) then
		continue
	end
	if moduleScript:GetAttribute("Hide") == true then
		continue
	end

	local module = require(moduleScript)

	local shells: { ShellModule } = {}

	for ammoKey, _ in module.AmmoTypes do
		local ammo = ShellModules[`{moduleScript.Name}:{ammoKey}`]

		local shell: ShellModule = {
			name = ammo.DisplayName,
			type = ammo.DisplayType,
			relatedVehicles = {},
			mass = ammo.ShellMass,
			velocity = math.round(GlobalConstants.studtom(ammo.MuzzleSpeed)),
			damage = math.round(ammo.Damage),
			shrapMultiplier = ammo.shrapmult,
			ricochetAngle = ammo.RicochetAngle,
			eraTip = ammo.ERAtip,

			maxPenetration = math.round(ammo.ShellMaxPen),
			penetrationTable = {},
		}

		for vehicleName, vehicleWeapons in vehicleWeaponReference do
			if table.find(vehicleWeapons, moduleScript.Name) then
				table.insert(shell.relatedVehicles, vehicleName)
			end
		end

		if shell.type == "ATGM HE" then
			shell.type = "HE"
		end

		do
			local angles = { 0, 30, 60 }
			local distances = { 0, 1_000, 2_000, 3_000 }

			for _, angle in angles do
				shell.penetrationTable[angle] = {}

				for _, distance in distances do
					local penLoss = GlobalConstants.PenLoss(GlobalConstants.mtostud(distance), ammo)
					local basePen = ammo.ShellMaxPen

					local calculatedPen = 0 / 0

					repeat
						if ammo.ShellType == "HE" then
							calculatedPen = basePen / math.cos(math.rad(angle))

							break
						end

						if ammo.ShellType == "HEAT" then
							calculatedPen = basePen

							break
						end

						-- apply pen loss after chemical types
						basePen *= penLoss

						if ammo.AngleCons ~= nil then
							local logBase05 = math.log(ammo.PenAt60 / basePen) / math.log(0.5)
							calculatedPen = basePen * math.cos(math.rad(angle)) ^ logBase05

							break
						end

						if string.find(shell.type, "APFSDS") then
							calculatedPen = basePen * math.cos(math.rad(angle)) ^ -0.224

							break
						end

						if true then
							calculatedPen = basePen * math.cos(math.rad(angle)) ^ 1.1

							break
						end
					until true

					local penArray = { math.round(calculatedPen) }

					if ammo.SAPHE then
						table.insert(
							penArray,
							-- same as formula as HE
							math.round(GlobalConstants.GetBlastPen(ammo) / math.cos(math.rad(angle)))
						)
					end

					shell.penetrationTable[angle][distance] = penArray
				end
			end
		end

		do
			if
				ammo.ExplosiveMass ~= nil
				and ammo.ExplosiveMass > 0
				and table.find({
					"HE", -- HESH/PROXIMITY FUZE/CLUSTER
					"HEAT",
					"APHE", -- SAPHE
				}, ammo.ShellType)
			then
				shell.explosive = {
					mass = ammo.ExplosiveMass,
					blastRadiusMultiplier = ammo.blastradiusmult,
					explosiveRadius = if ammo.DisplayType == "HE"
						then GlobalConstants.studtom(GlobalConstants.GetExplosionRadius(ammo))
						else nil,
				}
			end

			if string.find(shell.type, "ATGM") then
				shell.missile = {
					boostTime = ammo.BoostTime,
					turnRate = ammo.Turnrate,
					limit = ammo.Glimit,
					unjammable = if ammo.Behavior == "FOX2" then nil else (ammo.Unjammable or false),
					irccm = if ammo.Behavior == "FOX2" then ammo.IRCCM else nil,
				}
			end

			if shell.type == "CLUSTER" then
				shell.cluster = {
					submunitions = ammo.Submunitions or ammo.Count,
					dispersion = ammo.SubmunitionAngularDispersion or ammo.AngularDispersion,
				}
			end
		end

		do
			if ammo.Behavior == "FOX2" then
				shell.type = "AIR-TO-AIR MISSILE"
			end

			if ammo.Behavior == "SACLOS" then
				shell.type = "ANTI-TANK GUIDED MISSILE"
			end

			if ammo.Behavior == "MCLOS" then
				shell.type = "MACLOS MISSILE"
			end

			if ammo.Behavior == "LGM" then
				shell.type = "LASER GUIDED MISSILE"
			end

			if ammo.Behavior == "TAM" then
				shell.type = "F&F MISSILE"
			end

			if shell.type == "SMOKE SHELL" then
				shell.type = "SMOKE"
			end

			if shell.type == "CANISTER SHOT" then
				shell.type = "CANISTER"
			end

			if ammo.TANDEM then
				shell.type = `TANDEM {shell.type}`
			end

			if ammo.OTA then
				shell.type = `OTA {shell.type}`
			end
		end

		table.insert(shells, shell)
	end

	if #shells > 0 then
		weapons[moduleScript.Name] = shells
	end
end

return weapons
