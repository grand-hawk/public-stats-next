local ServerStorage = game:GetService("ServerStorage")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local DriveData = ReplicatedStorage:WaitForChild("NewDriveData") :: Folder
local TankModules = ReplicatedStorage:WaitForChild("TankModules") :: Folder
local VehicleDriveData = DriveData:WaitForChild("Vehicles") :: Folder
local Modules = ServerStorage:WaitForChild("Modules") :: Folder

local Engines = require(DriveData:WaitForChild("Engines") :: ModuleScript)
local TankInfo = require(ReplicatedStorage:WaitForChild("TankInfo") :: ModuleScript)
local GetVehicle = require(Modules:WaitForChild("GetVehicle") :: ModuleScript)
local ThermalNames = require(TankModules:WaitForChild("ThermalNames") :: ModuleScript)
local GeneralConfigs = require(TankModules:WaitForChild("Turrets"):WaitForChild("GeneralConfigs") :: ModuleScript)

local BaseFOV = 75

function tableEquals(table1, table2)
	for i, v in next, table1 do
		if table2[i] ~= v then
			return false
		end
	end
	for i, v in next, table2 do
		if table1[i] ~= v then
			return false
		end
	end
	return true
end

type VehicleModule = {
	name: string,
	mass: number,

	engine: {
		name: string,
		type: string,
		horsepower: number,
		maxRPM: number,
		forwardSpeed: number,
		reverseSpeed: number,

		transmission: {
			neutralSteering: boolean,
			forwardGears: number,
			reverseGears: number,
		},
	},

	suspension: {
		horizontal: boolean,
		vertical: boolean,
		height: boolean,
	}?,

	turrets: {
		[string]: {
			zoom: {
				min: number,
				max: number,
			},
			traverse: {
				speed: {
					horizontal: number,
					vertical: number,
				},
				vertical: {
					min: number,
					max: number,
				},
			},
			-- flares: boolean?,
			smokes: boolean?,
			stabilizer: boolean,
			thermals: string?,
			rangefinder: string?,
			weapons: { string },
		},
	},
}

local vehicles: { VehicleModule } = {}

for name, tank in TankInfo do
	if tank.Hidden then
		continue
	end

	local model = GetVehicle.getVehicle(name) :: Model?
	if not model then
		continue
	end

	local moduleScript = VehicleDriveData:FindFirstChild(name)
	if not moduleScript then
		continue
	end

	local module = require(moduleScript)
	local engine = Engines[module.Engine]

	if not engine then
		warn(`{name} could not find engine`)
		continue
	end

	local vehicle: VehicleModule = {
		name = tank.Dispname,
		mass = module.MassTon,
		amphibious = not not model:GetAttribute("Amphibious"),

		engine = {
			name = module.Engine,
			type = engine.EngineType,
			horsepower = engine.EnginePower,
			maxRPM = engine.maxRPM,
			forwardSpeed = module.ForwardSpeed,
			reverseSpeed = module.ReverseSpeed,

			transmission = {
				neutralSteering = module.neutralSteering or false,
				forwardGears = module.MaxForwardGear,
				reverseGears = module.MaxReverseGear,
			},
		},

		-- suspension = {},

		turrets = {},
	}

	if module.adjustSusp then
		vehicle.suspension = {
			horizontal = module.adjustSusp.Directions.HorLean or false,
			vertical = module.adjustSusp.Directions.VertTilt or false,
			height = module.adjustSusp.Directions.Height or false,
		}
	end

	local turretsFolder = model:FindFirstChild("Turrets") :: Folder
	for _, turret: Folder in turretsFolder:GetChildren() do
		local controlValue = turret:FindFirstChild("Control") :: ObjectValue
		if not controlValue.Value then
			warn(`{turret:GetFullName()} has no seat value`)
			continue
		end

		local seatName = controlValue.Value.Name
		if vehicle.turrets[seatName] then
			warn(`{controlValue.Value:GetFullName()} has multiple turrets`)
			continue
		end

		local weaponsFolder = turret:FindFirstChild("Weapons") :: Folder
		local turretInfoModule = turret:FindFirstChild("TurretInfo") :: ModuleScript
		local turretInfo = require(turretInfoModule)

		vehicle.turrets[seatName] = {
			zoom = {
				min = BaseFOV / turretInfo.Zoom[2],
				max = BaseFOV / turretInfo.Zoom[1],
			},
			traverse = {
				speed = {
					horizontal = turretInfo.anglelimits.horizontal[3],
					vertical = turretInfo.anglelimits.vertical[3],
				},
				vertical = {
					min = turretInfo.anglelimits.vertical[1],
					max = turretInfo.anglelimits.vertical[2],
				},
			},
			stabilizer = not not turretInfo.Stabiliser,
			weapons = {},
		}

		-- if weaponsFolder:FindFirstChild("Flares") then
		-- 	vehicle.turrets[seatName].flares = true
		-- end
		if weaponsFolder:FindFirstChild("Smoke Grenade") or seatName == "Gunner" then
			vehicle.turrets[seatName].smokes = not not weaponsFolder:FindFirstChild("Smoke Grenade")
		end

		if turretInfo.Thermal then
			vehicle.turrets[seatName].thermals = ThermalNames[turretInfo.Thermal.Type] or "Unknown"
		end

		if turretInfo.rangeFinderAccuracy then
			for name, referenceValues in GeneralConfigs.RangeFinder do
				if tableEquals(turretInfo.rangeFinderAccuracy, referenceValues) then
					vehicle.turrets[seatName].rangefinder = name
					break
				end
			end
		end

		for _, weapon: Folder in weaponsFolder:GetChildren() do
			local weaponName = weapon.Name
			if weaponName == "Smoke Grenade" or weaponName == "Flares" then
				continue
			end

			if not table.find(vehicle.turrets[seatName], weaponName) then
				table.insert(vehicle.turrets[seatName].weapons, weaponName)
			end
		end
	end

	table.insert(vehicles, vehicle)
end

return vehicles
