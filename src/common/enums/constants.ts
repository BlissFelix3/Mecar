export enum UserRole {
  USER = 'user',
  CAR_OWNER = 'car_owner',
  MECHANIC = 'mechanic',
  ADMIN = 'admin',
}

export enum ResourceType {
  Auto = 'auto',
  Image = 'image',
}

export enum STARLEVEL {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert',
}

export enum API_TAGS {
  AUTH = 'Auth',
  MECHANIC = 'Mechanic',
  ADMIN = 'Admin',
  HEALTH = 'Health Check',
  USER = 'User',
  PROFILE = 'User Profile',
  CAR_OWNER = 'Car Owner',
  CARS = 'Cars',
}

export enum OrderStatus {
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum ReviewRating {
  ONE_STAR = 1,
  TWO_STARS = 2,
  THREE_STARS = 3,
  FOUR_STARS = 4,
  FIVE_STARS = 5,
}

export enum ServiceType {
  MAINTENANCE_REPAIR = 'Maintenance Repair',
  GENERAL_REPAIR = 'General Repair',
}

export enum CancellationReason {
  UNREACHABLE = 'Unreachable',
  AGREEMENT_ISSUE = 'Agreement Issue',
  INSUFFICIENT_INFORMATION = 'Insufficient Information',
  EQUIPMENT_FAILURE = 'Equipment Failure',
  OVERBOOKING = 'Overbooking',
  HEALTH_ISSUES = 'Health Issues',
  VEHICLE_UNAVAILABILITY = 'Vehicle Unavailability',
  TECHNICAL_DIFFICULTIES = 'Technical Difficulties',
  WORKLOAD_OVERLOAD = 'Workload Overload',
}

export enum MaintenanceType {
  LIGHT_MAINTENANCE = 'Light Maintenance',
  SEMI_FULL_MAINTENANCE = 'Semi Full Maintenance',
  FULL_MAINTENANCE = 'Full Maintenance',
}

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
}

export enum OrderCustomerType {
  FIRST_TIME = 'FIRST_TIME',
  RETURNING = 'RETURNING',
}

export enum Services {
  OIL_CHANGE = 'Oil Change',
  BRAKE_INSPECTION = 'Brake Inspection',
  TIRE_ROTATION = 'Tire Rotation',
  BATTERY_CHECK = 'Battery Check',
  CHECK_ENGINE_LIGHT_DIAGNOSIS = 'Check Engine Light Diagnosis',
  ELECTRICAL_SYSTEM_DIAGNOSIS = 'Electrical System Diagnosis',
  TRANSMISSION_DIAGNOSIS = 'Transmission Diagnosis',
  ENGINE_REPAIR = 'Engine Repair',
  TRANSMISSION_REPAIR = 'Transmission Repair',
  TIMING_BELT_REPLACEMENT = 'Timing Belt Replacement',
  TIRE_REPLACEMENT = 'Tire Replacement',
  TIRE_BALANCING = 'Tire Balancing',
  WHEEL_ALIGNMENT = 'Wheel Alignment',
  BRAKE_PAD_REPLACEMENT = 'Brake Pad Replacement',
  SUSPENSION_REPAIR = 'Suspension Repair',
  SHOCK_ABSORBER_REPLACEMENT = 'Shock Absorber Replacement',
  AIR_CONDITIONING_REPAIR = 'Air Conditioning Repair',
  RADIATOR_FLUSH = 'Radiator Flush',
  HEATER_CARE_REPLACEMENT = 'Heater Care Replacement',
  MUFFLER_REPLACEMENT = 'Muffler Replacement',
  CATALYTIC_CONVERTER_REPAIR = 'Catalytic Converter Repair',
  EXHAUST_PIPE_WELDING = 'Exhaust Pipe Welding',
  BATTERY_REPLACEMENT = 'Battery Replacement',
  ALTERNATOR_REPLACEMENT = 'Alternator Replacement',
  STARTER_MOTOR_REPAIR = 'Starter Motor Repair',
  FUEL_INJECTOR_CLEANING = 'Fuel Injector Cleaning',
  FUEL_PUMP_REPLACEMENT = 'Fuel Pump Replacement',
  FUEL_FILTER_REPLACEMENT = 'Fuel Filter Replacement',
  COOLANT_FLUSH = 'Coolant Flush',
  TRANSMISSION_FLUID_CHANGE = 'Transmission Fluid Change',
  BRAKE_FLUID_REPLACEMENT = 'Brake Fluid Replacement',
  VEHICLE_SAFETY_INSPECTION = 'Vehicle Safety Inspection',
  BRAKE_SYSTEM_INSPECTION = 'Brake System Inspection',
  SUSPENSION_INSPECTION = 'Suspension Inspection',
  PERFORMANCE_TUNING = 'Performance Tuning',
  CAR_AUDIO_INSTALLATION = 'Car Audio Installation',
  LIGHTING_UPGRADES = 'Lighting Upgrades',
  ROAD_SIDE_ASSISTANCE = 'Road Side Assistance',
  JUMP_STARTS = 'Jump Starts',
  TOWING_SERVICES = 'Towing Services',
  INTERIOR_CLEANING = 'Interior Cleaning',
  EXTERIOR_POLISHING = 'Exterior Polishing',
  PAINT_PROTECTION = 'Paint Protection',
  VEHICLE_INSPECTION_FOR_BUYERS = 'Vehicle Inspection for Buyers',
  USED_CAR_EVALUATION = 'Used Car Evaluation',
  INSPECTION_REPORTS = 'Inspection Reports',
  CLASSIC_CAR_RESTORATION = 'Classic Car Restoration',
  HYBRID_VEHICLE_MAINTENANCE = 'Hybrid Vehicle Maintenance',
  DIESEL_ENGINE_SERVICES = 'Diesel Engine Services',
}

export enum ServiceCategory {
  BASIC_MAINTENANCE = 'BASIC_MAINTENANCE',
  DIAGNOSTIC_SERVICES = 'DIAGNOSTIC_SERVICES',
  ENGINE_AND_TRANSMISSION = 'ENGINE_AND_TRANSMISSION',
  TIRE_SERVICES = 'TIRE_SERVICES',
  BRAKE_AND_SUSPENSION = 'BRAKE_AND_SUSPENSION',
  HEATING_AND_COOLING = 'HEATING_AND_COOLING',
  EXHAUST_SYSTEM = 'EXHAUST_SYSTEM',
  ELECTRICAL_SERVICES = 'ELECTRICAL_SERVICES',
  FUEL_SYSTEM = 'FUEL_SYSTEM',
  FLUID_SERVICES = 'FLUID_SERVICES',
  SAFETY_INSPECTIONS = 'SAFETY_INSPECTIONS',
  CUSTOMIZATION_AND_UPGRADES = 'CUSTOMIZATION_AND_UPGRADES',
  EMERGENCY_SERVICES = 'EMERGENCY_SERVICES',
  AUTO_DETAILING = 'AUTO_DETAILING',
  PRE_PURCHASE_INSPECTION = 'PRE_PURCHASE_INSPECTION',
  SPECIALIZED_SERVICES = 'SPECIALIZED_SERVICES',
}
