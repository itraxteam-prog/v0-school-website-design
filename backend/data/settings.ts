export interface SchoolSettings {
    termStructure: string;
    schoolHours: {
        startTime: string;
        endTime: string;
    };
    maxClassesPerDay: number;
    defaultFeeStructure: {
        [grade: string]: number;
    };
}

export const initialSettings: SchoolSettings = {
    termStructure: "3 trimesters",
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
};
