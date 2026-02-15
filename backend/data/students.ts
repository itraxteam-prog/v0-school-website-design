export interface Student {
    id: string;
    name: string;
    rollNo: string;
    classId: string;
    dob: string;
    guardianPhone: string;
    address: string;
}

export const students: Student[] = [
    {
        id: "std-001",
        name: "Aarav Sharma",
        rollNo: "101",
        classId: "cls-001",
        dob: "2010-05-12",
        guardianPhone: "+91-9876543210",
        address: "123, Maple Street, New Delhi",
    },
    {
        id: "std-002",
        name: "Ishani Gupta",
        rollNo: "102",
        classId: "cls-001",
        dob: "2010-08-22",
        guardianPhone: "+91-9876543211",
        address: "456, Oak Lane, Mumbai",
    },
    {
        id: "std-003",
        name: "Vihaan Reddy",
        rollNo: "201",
        classId: "cls-002",
        dob: "2009-03-15",
        guardianPhone: "+91-9876543212",
        address: "789, Pine Road, Bangalore",
    },
    {
        id: "std-004",
        name: "Ananya Iyer",
        rollNo: "202",
        classId: "cls-002",
        dob: "2009-11-30",
        guardianPhone: "+91-9876543213",
        address: "321, Cedar Ave, Chennai",
    },
    {
        id: "std-005",
        name: "Kabir Malhotra",
        rollNo: "301",
        classId: "cls-003",
        dob: "2008-01-10",
        guardianPhone: "+91-9876543214",
        address: "654, Birch Blvd, Kolkata",
    },
];
