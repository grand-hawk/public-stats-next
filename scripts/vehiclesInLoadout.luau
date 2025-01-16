local ServerStorage = game:GetService("ServerStorage")
local Loadouts = ServerStorage:FindFirstChild("Loadouts") :: Folder

local vehicleList: { string } = {}

function iterateLoadout(loadout)
	for _, vehicle in pairs(loadout) do
		table.insert(vehicleList, vehicle.NameID)
	end
end

for _, loadoutFolder in Loadouts:GetChildren() do
	local dataModule = loadoutFolder:FindFirstChild("Data") :: ModuleScript
	local data = require(dataModule)

	local vehicles = data.Vehicles

	iterateLoadout(vehicles.GeneralLoadout)

	for team, teamLoadout in pairs(vehicles.TeamSpecificLoadout) do
		iterateLoadout(teamLoadout)
	end
end

local withoutDuplicates: { string } = {}
for _, vehicle in pairs(vehicleList) do
	if not table.find(withoutDuplicates, vehicle) then
		table.insert(withoutDuplicates, vehicle)
	end
end

print(game:GetService("HttpService"):JSONEncode(withoutDuplicates))

return withoutDuplicates
