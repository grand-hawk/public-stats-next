local ServerStorage = game:GetService("ServerStorage")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local DriveData = ReplicatedStorage:WaitForChild("NewDriveData") :: Folder
local VehicleDriveData = DriveData:WaitForChild("Vehicles") :: Folder
local Modules = ServerStorage:WaitForChild("Modules") :: Folder

local Engines = require(DriveData:WaitForChild("Engines") :: ModuleScript)
local TankInfo = require(ReplicatedStorage:WaitForChild("TankInfo") :: ModuleScript)
local GetVehicle = require(Modules:WaitForChild("GetVehicle") :: ModuleScript)

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
}

local vehicles: { VehicleModule } = {}

for name, tank in TankInfo do
	if tank.Hidden then
		continue
	end

	local model = GetVehicle.getVehicle(name)
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
	}

	table.insert(vehicles, vehicle)
end

print(game:GetService("HttpService"):JSONEncode(vehicles))

return vehicles
