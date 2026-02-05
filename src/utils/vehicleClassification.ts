export const classifications: Record<string, string[]> = {
  Light: [
    'Reconnaissance Vehicle',
    'Infantry Fighting Vehicle',
    'Tankette',
    'Commander Vehicle',
    'Light Tank',
  ],
  Medium: ['Medium Tank', 'Main Battle Tank', 'Hybrid Combat Vehicle'],
  Heavy: [
    'Heavy Tank',
    'Fire Support Vehicle',
    'Support Vehicle',
    'Super Heavy Tank',
    'Prototype Main Battle Tank',
  ],
  Artillery: [
    'Self Propelled Howitzer',
    'Rocket Artillery',
    'Tank Destroyer',
    'Self Propelled Anti Aircraft',
    'Flamethrower Tank',
    'Assault Gun',
    'Anti Tank Missile Carrier',
  ],
  Aircraft: ['Utility Helicopter', 'Attack Helicopter', 'Helicopter Gunship'],
  Transport: [
    'Half-track Motorcycle',
    'Transport Vehicle',
    'Utility Vehicle',
    'Supply Truck',
    'Armoured Personnel Carrier',
    'Amphibious Vehicle',
  ],
};

export function getClassification(role: string): string {
  for (const [classification, roles] of Object.entries(classifications)) {
    if (roles.includes(role)) return classification;
  }
  return 'Other';
}

export const classificationOrder = [
  'Light',
  'Medium',
  'Heavy',
  'Artillery',
  'Aircraft',
  'Transport',
  'Other',
];
