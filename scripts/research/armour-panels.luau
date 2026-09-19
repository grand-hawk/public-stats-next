local fs = require("@lune/fs")
local roblox = require("@lune/roblox")
local serde = require("@lune/serde")

local rows = {}

local function vehicleOf(instance)
	local current = instance
	local top = nil
	while current and current.Parent do
		if current.ClassName == "Model" then
			top = current
		end
		current = current.Parent
	end
	return top
end

local function pathOf(instance, depth)
	local parts = {}
	local current = instance
	for _ = 1, depth do
		if not current then
			break
		end
		table.insert(parts, 1, current.Name)
		current = current.Parent
	end
	return table.concat(parts, "/")
end

local function scan(root, source)
	for _, descendant in root:GetDescendants() do
		if descendant.Name == "ArmourValue" and descendant.ClassName == "NumberValue" then
			local heat = descendant:GetAttribute("HEAT")
			local antiTandem = descendant:GetAttribute("AntiTandem")
			local parent = descendant.Parent
			if (heat or antiTandem) and parent then
				local vehicle = vehicleOf(descendant)
				table.insert(rows, {
					source = source,
					vehicle = vehicle and vehicle.Name or "?",
					vehiclePath = vehicle and pathOf(vehicle, 4) or "?",
					part = parent.Name,
					ke = descendant.Value,
					heat = heat or 0,
					antiTandem = antiTandem or 0,
					destructible = parent:FindFirstChild("DamageEvent") ~= nil,
					era = parent:GetAttribute("ERA") or descendant:GetAttribute("ERA") or false,
				})
			end
		end
	end
end

for _, file in fs.readDir("model-assets") do
	if string.sub(file, -5) == ".rbxm" then
		local ok, instances = pcall(roblox.deserializeModel, fs.readFile("model-assets/" .. file))
		if ok then
			for _, instance in instances do
				scan(instance, instance.Name)
			end
		end
	end
end

print(serde.encode("json", rows))
