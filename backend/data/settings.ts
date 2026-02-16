export interface SchoolSettings {
    schoolName: string;
    schoolCode: string;
    address: string;
    contactNumber: string;
    email: string;
    termStructure: string;
    gradingSystem: string;
    promotionThreshold: number;
    schoolHours: {
        startTime: string;
        endTime: string;
    };
    maxClassesPerDay: number;
    defaultFeeStructure: {
        [grade: string]: number;
    };
    portalPreferences: {
        darkMode: boolean;
        language: string;
        timezone: string;
        smsNotifications: boolean;
        emailNotifications: boolean;
    };
}

export const initialSettings: SchoolSettings = {
    schoolName: "Pioneers High School & College",
    schoolCode: "PHS-2024",
    address: "Model Town, Phase II, Lahore, Pakistan",
    contactNumber: "+92 42 35123456",
    email: "admin@pioneershigh.edu.pk",
    termStructure: "3",
    gradingSystem: "relative",
    promotionThreshold: 40,
    schoolHours: {
        startTime: "08:00 AM",
        endTime: "03:00 PM",
    },
    maxClassesPerDay: 8,
    defaultFeeStructure: {
        "Elementary": 5000,
        "Middle School": 7000,
        "High School": 10000,
    },
    portalPreferences: {
        darkMode: false,
        language: "en",
        timezone: "pk",
        smsNotifications: true,
        emailNotifications: true,
    },
};
