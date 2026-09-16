"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  Search,
  Stethoscope,
  Video,
  Building2,
} from "lucide-react";

type DoctorStatus = "Available" | "Busy" | "On Leave";

type Doctor = {
  id: string;
  name: string;
  gender?: "male" | "female";
  department: string;
  specialization?: string;
  specialty?: string;
  branch: string;
  experience?: number;
  patients?: number;
  phone?: string;
  email?: string;
  status?: DoctorStatus;
  image?: string;
};

type AppointmentMode = "Physical" | "Video Consult";

const DOCTORS_STORAGE_KEY = "avshDoctors";
const APPOINTMENT_STORAGE_KEY = "avshAppointment";
const SELECTED_BRANCH_KEY = "avshSelectedBranch";

const branches = [
  "AVSH Hyderabad",
  "AVSH Bengaluru",
  "AVSH Chennai",
  "AVSH Mumbai",
];

const departments = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Gastroenterology",
  "Gynecology & Obstetrics",
  "Ophthalmology",
  "Urology",
  "General Medicine",
];

const fallbackDoctors: Doctor[] = [
  {
    id: "AVSH-001",
    name: "Dr. Aarav Reddy",
    gender: "male",
    department: "Cardiology",
    specialization: "Cardiac Care",
    branch: "AVSH Hyderabad",
    experience: 8,
    status: "Available",
  },
  {
    id: "AVSH-002",
    name: "Dr. Ishaan Sharma",
    gender: "male",
    department: "Cardiology",
    specialization: "Cardiac Care",
    branch: "AVSH Hyderabad",
    experience: 10,
    status: "Available",
  },
  {
    id: "AVSH-003",
    name: "Dr. Karthik Menon",
    gender: "male",
    department: "Cardiology",
    specialization: "Cardiac Care",
    branch: "AVSH Hyderabad",
    experience: 12,
    status: "Available",
  },
  {
    id: "AVSH-004",
    name: "Dr. Meera Sharma",
    gender: "female",
    department: "Neurology",
    specialization: "Neurology & Stroke Care",
    branch: "AVSH Hyderabad",
    experience: 9,
    status: "Available",
  },
  {
    id: "AVSH-005",
    name: "Dr. Nisha Menon",
    gender: "female",
    department: "Neurology",
    specialization: "Neurology & Stroke Care",
    branch: "AVSH Hyderabad",
    experience: 11,
    status: "Available",
  },
  {
    id: "AVSH-006",
    name: "Dr. Tanvi Iyer",
    gender: "female",
    department: "Neurology",
    specialization: "Neurology & Stroke Care",
    branch: "AVSH Hyderabad",
    experience: 13,
    status: "Available",
  },
  {
    id: "AVSH-007",
    name: "Dr. Vivek Menon",
    gender: "male",
    department: "Orthopedics",
    specialization: "Joint Replacement & Sports Medicine",
    branch: "AVSH Hyderabad",
    experience: 10,
    status: "Available",
  },
  {
    id: "AVSH-008",
    name: "Dr. Sanjay Iyer",
    gender: "male",
    department: "Orthopedics",
    specialization: "Joint Replacement & Sports Medicine",
    branch: "AVSH Hyderabad",
    experience: 12,
    status: "Available",
  },
  {
    id: "AVSH-009",
    name: "Dr. Raghav Kapoor",
    gender: "male",
    department: "Orthopedics",
    specialization: "Joint Replacement & Sports Medicine",
    branch: "AVSH Hyderabad",
    experience: 14,
    status: "Available",
  },
  {
    id: "AVSH-010",
    name: "Dr. Riya Iyer",
    gender: "female",
    department: "Pediatrics",
    specialization: "Child & Adolescent Care",
    branch: "AVSH Hyderabad",
    experience: 11,
    status: "Available",
  },
  {
    id: "AVSH-011",
    name: "Dr. Anika Kapoor",
    gender: "female",
    department: "Pediatrics",
    specialization: "Child & Adolescent Care",
    branch: "AVSH Hyderabad",
    experience: 13,
    status: "Available",
  },
  {
    id: "AVSH-012",
    name: "Dr. Saanvi Nair",
    gender: "female",
    department: "Pediatrics",
    specialization: "Child & Adolescent Care",
    branch: "AVSH Hyderabad",
    experience: 15,
    status: "Available",
  },
  {
    id: "AVSH-013",
    name: "Dr. Arjun Kapoor",
    gender: "male",
    department: "Dermatology",
    specialization: "Clinical Dermatology",
    branch: "AVSH Hyderabad",
    experience: 12,
    status: "Available",
  },
  {
    id: "AVSH-014",
    name: "Dr. Manoj Nair",
    gender: "male",
    department: "Dermatology",
    specialization: "Clinical Dermatology",
    branch: "AVSH Hyderabad",
    experience: 14,
    status: "Available",
  },
  {
    id: "AVSH-015",
    name: "Dr. Ira Rao",
    gender: "female",
    department: "Dermatology",
    specialization: "Clinical Dermatology",
    branch: "AVSH Hyderabad",
    experience: 16,
    status: "Available",
  },
  {
    id: "AVSH-016",
    name: "Dr. Rahul Nair",
    gender: "male",
    department: "Gastroenterology",
    specialization: "Digestive Health",
    branch: "AVSH Hyderabad",
    experience: 13,
    status: "Available",
  },
  {
    id: "AVSH-017",
    name: "Dr. Vikrant Rao",
    gender: "male",
    department: "Gastroenterology",
    specialization: "Digestive Health",
    branch: "AVSH Hyderabad",
    experience: 15,
    status: "Available",
  },
  {
    id: "AVSH-018",
    name: "Dr. Sameer Mehta",
    gender: "male",
    department: "Gastroenterology",
    specialization: "Digestive Health",
    branch: "AVSH Hyderabad",
    experience: 17,
    status: "Available",
  },
  {
    id: "AVSH-019",
    name: "Dr. Pallavi Rao",
    gender: "female",
    department: "Gynecology & Obstetrics",
    specialization: "Women’s Health & Obstetrics",
    branch: "AVSH Hyderabad",
    experience: 14,
    status: "Available",
  },
  {
    id: "AVSH-020",
    name: "Dr. Sneha Mehta",
    gender: "female",
    department: "Gynecology & Obstetrics",
    specialization: "Women’s Health & Obstetrics",
    branch: "AVSH Hyderabad",
    experience: 16,
    status: "Available",
  },
  {
    id: "AVSH-021",
    name: "Dr. Kavya Verma",
    gender: "female",
    department: "Gynecology & Obstetrics",
    specialization: "Women’s Health & Obstetrics",
    branch: "AVSH Hyderabad",
    experience: 18,
    status: "Available",
  },
  {
    id: "AVSH-022",
    name: "Dr. Aditya Mehta",
    gender: "male",
    department: "Ophthalmology",
    specialization: "Eye Care & Surgery",
    branch: "AVSH Hyderabad",
    experience: 15,
    status: "Available",
  },
  {
    id: "AVSH-023",
    name: "Dr. Ritesh Verma",
    gender: "male",
    department: "Ophthalmology",
    specialization: "Eye Care & Surgery",
    branch: "AVSH Hyderabad",
    experience: 17,
    status: "Available",
  },
  {
    id: "AVSH-024",
    name: "Dr. Varun Khanna",
    gender: "male",
    department: "Ophthalmology",
    specialization: "Eye Care & Surgery",
    branch: "AVSH Hyderabad",
    experience: 19,
    status: "Available",
  },
  {
    id: "AVSH-025",
    name: "Dr. Naveen Verma",
    gender: "male",
    department: "Urology",
    specialization: "Urology & Endourology",
    branch: "AVSH Hyderabad",
    experience: 16,
    status: "Available",
  },
  {
    id: "AVSH-026",
    name: "Dr. Siddharth Khanna",
    gender: "male",
    department: "Urology",
    specialization: "Urology & Endourology",
    branch: "AVSH Hyderabad",
    experience: 18,
    status: "Available",
  },
  {
    id: "AVSH-027",
    name: "Dr. Harsha Reddy",
    gender: "male",
    department: "Urology",
    specialization: "Urology & Endourology",
    branch: "AVSH Hyderabad",
    experience: 20,
    status: "Available",
  },
  {
    id: "AVSH-028",
    name: "Dr. Prakash Khanna",
    gender: "male",
    department: "General Medicine",
    specialization: "Internal Medicine",
    branch: "AVSH Hyderabad",
    experience: 17,
    status: "Available",
  },
  {
    id: "AVSH-029",
    name: "Dr. Rohit Reddy",
    gender: "male",
    department: "General Medicine",
    specialization: "Internal Medicine",
    branch: "AVSH Hyderabad",
    experience: 19,
    status: "Available",
  },
  {
    id: "AVSH-030",
    name: "Dr. Amit Sharma",
    gender: "male",
    department: "General Medicine",
    specialization: "Internal Medicine",
    branch: "AVSH Hyderabad",
    experience: 8,
    status: "Available",
  },
  {
    id: "AVSH-031",
    name: "Dr. Aditya Malhotra",
    gender: "male",
    department: "Cardiology",
    specialization: "Cardiac Care",
    branch: "AVSH Bengaluru",
    experience: 11,
    status: "Available",
  },
  {
    id: "AVSH-032",
    name: "Dr. Karan Iyer",
    gender: "male",
    department: "Cardiology",
    specialization: "Cardiac Care",
    branch: "AVSH Bengaluru",
    experience: 13,
    status: "Available",
  },
  {
    id: "AVSH-033",
    name: "Dr. Rohan Kapoor",
    gender: "male",
    department: "Cardiology",
    specialization: "Cardiac Care",
    branch: "AVSH Bengaluru",
    experience: 15,
    status: "Available",
  },
  {
    id: "AVSH-034",
    name: "Dr. Kavya Iyer",
    gender: "female",
    department: "Neurology",
    specialization: "Neurology & Stroke Care",
    branch: "AVSH Bengaluru",
    experience: 12,
    status: "Available",
  },
  {
    id: "AVSH-035",
    name: "Dr. Meera Kapoor",
    gender: "female",
    department: "Neurology",
    specialization: "Neurology & Stroke Care",
    branch: "AVSH Bengaluru",
    experience: 14,
    status: "Available",
  },
  {
    id: "AVSH-036",
    name: "Dr. Aditi Menon",
    gender: "female",
    department: "Neurology",
    specialization: "Neurology & Stroke Care",
    branch: "AVSH Bengaluru",
    experience: 16,
    status: "Available",
  },
  {
    id: "AVSH-037",
    name: "Dr. Rohan Kapoor",
    gender: "male",
    department: "Orthopedics",
    specialization: "Joint Replacement & Sports Medicine",
    branch: "AVSH Bengaluru",
    experience: 13,
    status: "Available",
  },
  {
    id: "AVSH-038",
    name: "Dr. Siddharth Menon",
    gender: "male",
    department: "Orthopedics",
    specialization: "Joint Replacement & Sports Medicine",
    branch: "AVSH Bengaluru",
    experience: 15,
    status: "Available",
  },
  {
    id: "AVSH-039",
    name: "Dr. Nikhil Rao",
    gender: "male",
    department: "Orthopedics",
    specialization: "Joint Replacement & Sports Medicine",
    branch: "AVSH Bengaluru",
    experience: 17,
    status: "Available",
  },
  {
    id: "AVSH-040",
    name: "Dr. Meera Menon",
    gender: "female",
    department: "Pediatrics",
    specialization: "Child & Adolescent Care",
    branch: "AVSH Bengaluru",
    experience: 14,
    status: "Available",
  },
  {
    id: "AVSH-041",
    name: "Dr. Sneha Rao",
    gender: "female",
    department: "Pediatrics",
    specialization: "Child & Adolescent Care",
    branch: "AVSH Bengaluru",
    experience: 16,
    status: "Available",
  },
  {
    id: "AVSH-042",
    name: "Dr. Ananya Nair",
    gender: "female",
    department: "Pediatrics",
    specialization: "Child & Adolescent Care",
    branch: "AVSH Bengaluru",
    experience: 18,
    status: "Available",
  },
  {
    id: "AVSH-043",
    name: "Dr. Arjun Rao",
    gender: "male",
    department: "Dermatology",
    specialization: "Clinical Dermatology",
    branch: "AVSH Bengaluru",
    experience: 15,
    status: "Available",
  },
  {
    id: "AVSH-044",
    name: "Dr. Vikram Nair",
    gender: "male",
    department: "Dermatology",
    specialization: "Clinical Dermatology",
    branch: "AVSH Bengaluru",
    experience: 17,
    status: "Available",
  },
  {
    id: "AVSH-045",
    name: "Dr. Manoj Shah",
    gender: "male",
    department: "Dermatology",
    specialization: "Clinical Dermatology",
    branch: "AVSH Bengaluru",
    experience: 19,
    status: "Available",
  },
  {
    id: "AVSH-046",
    name: "Dr. Nikhil Nair",
    gender: "male",
    department: "Gastroenterology",
    specialization: "Digestive Health",
    branch: "AVSH Bengaluru",
    experience: 16,
    status: "Available",
  },
  {
    id: "AVSH-047",
    name: "Dr. Rahul Shah",
    gender: "male",
    department: "Gastroenterology",
    specialization: "Digestive Health",
    branch: "AVSH Bengaluru",
    experience: 18,
    status: "Available",
  },
  {
    id: "AVSH-048",
    name: "Dr. Samar Reddy",
    gender: "male",
    department: "Gastroenterology",
    specialization: "Digestive Health",
    branch: "AVSH Bengaluru",
    experience: 20,
    status: "Available",
  },
  {
    id: "AVSH-049",
    name: "Dr. Pooja Shah",
    gender: "female",
    department: "Gynecology & Obstetrics",
    specialization: "Women’s Health & Obstetrics",
    branch: "AVSH Bengaluru",
    experience: 17,
    status: "Available",
  },
  {
    id: "AVSH-050",
    name: "Dr. Kavya Reddy",
    gender: "female",
    department: "Gynecology & Obstetrics",
    specialization: "Women’s Health & Obstetrics",
    branch: "AVSH Bengaluru",
    experience: 19,
    status: "Available",
  },
  {
    id: "AVSH-051",
    name: "Dr. Divya Khanna",
    gender: "female",
    department: "Gynecology & Obstetrics",
    specialization: "Women’s Health & Obstetrics",
    branch: "AVSH Bengaluru",
    experience: 8,
    status: "Available",
  },
  {
    id: "AVSH-052",
    name: "Dr. Ananya Reddy",
    gender: "female",
    department: "Ophthalmology",
    specialization: "Eye Care & Surgery",
    branch: "AVSH Bengaluru",
    experience: 18,
    status: "Available",
  },
  {
    id: "AVSH-053",
    name: "Dr. Ishita Khanna",
    gender: "female",
    department: "Ophthalmology",
    specialization: "Eye Care & Surgery",
    branch: "AVSH Bengaluru",
    experience: 20,
    status: "Available",
  },
  {
    id: "AVSH-054",
    name: "Dr. Keerthi Deshmukh",
    gender: "female",
    department: "Ophthalmology",
    specialization: "Eye Care & Surgery",
    branch: "AVSH Bengaluru",
    experience: 9,
    status: "Available",
  },
  {
    id: "AVSH-055",
    name: "Dr. Vivek Khanna",
    gender: "male",
    department: "Urology",
    specialization: "Urology & Endourology",
    branch: "AVSH Bengaluru",
    experience: 19,
    status: "Available",
  },
  {
    id: "AVSH-056",
    name: "Dr. Arvind Deshmukh",
    gender: "male",
    department: "Urology",
    specialization: "Urology & Endourology",
    branch: "AVSH Bengaluru",
    experience: 8,
    status: "Available",
  },
  {
    id: "AVSH-057",
    name: "Dr. Yash Malhotra",
    gender: "male",
    department: "Urology",
    specialization: "Urology & Endourology",
    branch: "AVSH Bengaluru",
    experience: 10,
    status: "Available",
  },
  {
    id: "AVSH-058",
    name: "Dr. Pooja Deshmukh",
    gender: "female",
    department: "General Medicine",
    specialization: "Internal Medicine",
    branch: "AVSH Bengaluru",
    experience: 20,
    status: "Available",
  },
  {
    id: "AVSH-059",
    name: "Dr. Karthik Malhotra",
    gender: "male",
    department: "General Medicine",
    specialization: "Internal Medicine",
    branch: "AVSH Bengaluru",
    experience: 9,
    status: "Available",
  },
  {
    id: "AVSH-060",
    name: "Dr. Sanjay Iyer",
    gender: "male",
    department: "General Medicine",
    specialization: "Internal Medicine",
    branch: "AVSH Bengaluru",
    experience: 11,
    status: "Available",
  },
  {
    id: "AVSH-061",
    name: "Dr. Arvind Iyer",
    gender: "male",
    department: "Cardiology",
    specialization: "Cardiac Care",
    branch: "AVSH Chennai",
    experience: 14,
    status: "Available",
  },
  {
    id: "AVSH-062",
    name: "Dr. Pranav Nair",
    gender: "male",
    department: "Cardiology",
    specialization: "Cardiac Care",
    branch: "AVSH Chennai",
    experience: 16,
    status: "Available",
  },
  {
    id: "AVSH-063",
    name: "Dr. Siddharth Menon",
    gender: "male",
    department: "Cardiology",
    specialization: "Cardiac Care",
    branch: "AVSH Chennai",
    experience: 18,
    status: "Available",
  },
  {
    id: "AVSH-064",
    name: "Dr. Divya Nair",
    gender: "female",
    department: "Neurology",
    specialization: "Neurology & Stroke Care",
    branch: "AVSH Chennai",
    experience: 15,
    status: "Available",
  },
  {
    id: "AVSH-065",
    name: "Dr. Shreya Menon",
    gender: "female",
    department: "Neurology",
    specialization: "Neurology & Stroke Care",
    branch: "AVSH Chennai",
    experience: 17,
    status: "Available",
  },
  {
    id: "AVSH-066",
    name: "Dr. Aishwarya Rao",
    gender: "female",
    department: "Neurology",
    specialization: "Neurology & Stroke Care",
    branch: "AVSH Chennai",
    experience: 19,
    status: "Available",
  },
  {
    id: "AVSH-067",
    name: "Dr. Harish Menon",
    gender: "male",
    department: "Orthopedics",
    specialization: "Joint Replacement & Sports Medicine",
    branch: "AVSH Chennai",
    experience: 16,
    status: "Available",
  },
  {
    id: "AVSH-068",
    name: "Dr. Varun Rao",
    gender: "male",
    department: "Orthopedics",
    specialization: "Joint Replacement & Sports Medicine",
    branch: "AVSH Chennai",
    experience: 18,
    status: "Available",
  },
  {
    id: "AVSH-069",
    name: "Dr. Karthik Verma",
    gender: "male",
    department: "Orthopedics",
    specialization: "Joint Replacement & Sports Medicine",
    branch: "AVSH Chennai",
    experience: 20,
    status: "Available",
  },
  {
    id: "AVSH-070",
    name: "Dr. Keerthi Rao",
    gender: "female",
    department: "Pediatrics",
    specialization: "Child & Adolescent Care",
    branch: "AVSH Chennai",
    experience: 17,
    status: "Available",
  },
  {
    id: "AVSH-071",
    name: "Dr. Lavanya Verma",
    gender: "female",
    department: "Pediatrics",
    specialization: "Child & Adolescent Care",
    branch: "AVSH Chennai",
    experience: 19,
    status: "Available",
  },
  {
    id: "AVSH-072",
    name: "Dr. Nandita Shah",
    gender: "female",
    department: "Pediatrics",
    specialization: "Child & Adolescent Care",
    branch: "AVSH Chennai",
    experience: 8,
    status: "Available",
  },
  {
    id: "AVSH-073",
    name: "Dr. Pranav Verma",
    gender: "male",
    department: "Dermatology",
    specialization: "Clinical Dermatology",
    branch: "AVSH Chennai",
    experience: 18,
    status: "Available",
  },
  {
    id: "AVSH-074",
    name: "Dr. Arun Shah",
    gender: "male",
    department: "Dermatology",
    specialization: "Clinical Dermatology",
    branch: "AVSH Chennai",
    experience: 20,
    status: "Available",
  },
  {
    id: "AVSH-075",
    name: "Dr. Mohan Krishnan",
    gender: "male",
    department: "Dermatology",
    specialization: "Clinical Dermatology",
    branch: "AVSH Chennai",
    experience: 9,
    status: "Available",
  },
  {
    id: "AVSH-076",
    name: "Dr. Shreya Shah",
    gender: "female",
    department: "Gastroenterology",
    specialization: "Digestive Health",
    branch: "AVSH Chennai",
    experience: 19,
    status: "Available",
  },
  {
    id: "AVSH-077",
    name: "Dr. Deepak Krishnan",
    gender: "male",
    department: "Gastroenterology",
    specialization: "Digestive Health",
    branch: "AVSH Chennai",
    experience: 8,
    status: "Available",
  },
  {
    id: "AVSH-078",
    name: "Dr. Vignesh Reddy",
    gender: "male",
    department: "Gastroenterology",
    specialization: "Digestive Health",
    branch: "AVSH Chennai",
    experience: 10,
    status: "Available",
  },
  {
    id: "AVSH-079",
    name: "Dr. Aishwarya Krishnan",
    gender: "female",
    department: "Gynecology & Obstetrics",
    specialization: "Women’s Health & Obstetrics",
    branch: "AVSH Chennai",
    experience: 20,
    status: "Available",
  },
  {
    id: "AVSH-080",
    name: "Dr. Divya Reddy",
    gender: "female",
    department: "Gynecology & Obstetrics",
    specialization: "Women’s Health & Obstetrics",
    branch: "AVSH Chennai",
    experience: 9,
    status: "Available",
  },
  {
    id: "AVSH-081",
    name: "Dr. Nivedita Deshmukh",
    gender: "female",
    department: "Gynecology & Obstetrics",
    specialization: "Women’s Health & Obstetrics",
    branch: "AVSH Chennai",
    experience: 11,
    status: "Available",
  },
  {
    id: "AVSH-082",
    name: "Dr. Varun Reddy",
    gender: "male",
    department: "Ophthalmology",
    specialization: "Eye Care & Surgery",
    branch: "AVSH Chennai",
    experience: 8,
    status: "Available",
  },
  {
    id: "AVSH-083",
    name: "Dr. Arvind Deshmukh",
    gender: "male",
    department: "Ophthalmology",
    specialization: "Eye Care & Surgery",
    branch: "AVSH Chennai",
    experience: 10,
    status: "Available",
  },
  {
    id: "AVSH-084",
    name: "Dr. Madhavan Kapoor",
    gender: "male",
    department: "Ophthalmology",
    specialization: "Eye Care & Surgery",
    branch: "AVSH Chennai",
    experience: 12,
    status: "Available",
  },
  {
    id: "AVSH-085",
    name: "Dr. Siddharth Deshmukh",
    gender: "male",
    department: "Urology",
    specialization: "Urology & Endourology",
    branch: "AVSH Chennai",
    experience: 9,
    status: "Available",
  },
  {
    id: "AVSH-086",
    name: "Dr. Hari Kapoor",
    gender: "male",
    department: "Urology",
    specialization: "Urology & Endourology",
    branch: "AVSH Chennai",
    experience: 11,
    status: "Available",
  },
  {
    id: "AVSH-087",
    name: "Dr. Kiran Iyer",
    gender: "male",
    department: "Urology",
    specialization: "Urology & Endourology",
    branch: "AVSH Chennai",
    experience: 13,
    status: "Available",
  },
  {
    id: "AVSH-088",
    name: "Dr. Lavanya Kapoor",
    gender: "female",
    department: "General Medicine",
    specialization: "Internal Medicine",
    branch: "AVSH Chennai",
    experience: 10,
    status: "Available",
  },
  {
    id: "AVSH-089",
    name: "Dr. Meenakshi Iyer",
    gender: "female",
    department: "General Medicine",
    specialization: "Internal Medicine",
    branch: "AVSH Chennai",
    experience: 12,
    status: "Available",
  },
  {
    id: "AVSH-090",
    name: "Dr. Ramesh Nair",
    gender: "male",
    department: "General Medicine",
    specialization: "Internal Medicine",
    branch: "AVSH Chennai",
    experience: 14,
    status: "Available",
  },
  {
    id: "AVSH-091",
    name: "Dr. Kabir Shah",
    gender: "male",
    department: "Cardiology",
    specialization: "Cardiac Care",
    branch: "AVSH Mumbai",
    experience: 17,
    status: "Available",
  },
  {
    id: "AVSH-092",
    name: "Dr. Yash Kapoor",
    gender: "male",
    department: "Cardiology",
    specialization: "Cardiac Care",
    branch: "AVSH Mumbai",
    experience: 19,
    status: "Available",
  },
  {
    id: "AVSH-093",
    name: "Dr. Dhruv Bhatia",
    gender: "male",
    department: "Cardiology",
    specialization: "Cardiac Care",
    branch: "AVSH Mumbai",
    experience: 8,
    status: "Available",
  },
  {
    id: "AVSH-094",
    name: "Dr. Ira Kapoor",
    gender: "female",
    department: "Neurology",
    specialization: "Neurology & Stroke Care",
    branch: "AVSH Mumbai",
    experience: 18,
    status: "Available",
  },
  {
    id: "AVSH-095",
    name: "Dr. Rhea Bhatia",
    gender: "female",
    department: "Neurology",
    specialization: "Neurology & Stroke Care",
    branch: "AVSH Mumbai",
    experience: 20,
    status: "Available",
  },
  {
    id: "AVSH-096",
    name: "Dr. Tara Mehta",
    gender: "female",
    department: "Neurology",
    specialization: "Neurology & Stroke Care",
    branch: "AVSH Mumbai",
    experience: 9,
    status: "Available",
  },
  {
    id: "AVSH-097",
    name: "Dr. Manav Bhatia",
    gender: "male",
    department: "Orthopedics",
    specialization: "Joint Replacement & Sports Medicine",
    branch: "AVSH Mumbai",
    experience: 19,
    status: "Available",
  },
  {
    id: "AVSH-098",
    name: "Dr. Neil Mehta",
    gender: "male",
    department: "Orthopedics",
    specialization: "Joint Replacement & Sports Medicine",
    branch: "AVSH Mumbai",
    experience: 8,
    status: "Available",
  },
  {
    id: "AVSH-099",
    name: "Dr. Aman Malhotra",
    gender: "male",
    department: "Orthopedics",
    specialization: "Joint Replacement & Sports Medicine",
    branch: "AVSH Mumbai",
    experience: 10,
    status: "Available",
  },
  {
    id: "AVSH-100",
    name: "Dr. Nandini Mehta",
    gender: "female",
    department: "Pediatrics",
    specialization: "Child & Adolescent Care",
    branch: "AVSH Mumbai",
    experience: 20,
    status: "Available",
  },
  {
    id: "AVSH-101",
    name: "Dr. Kiara Malhotra",
    gender: "female",
    department: "Pediatrics",
    specialization: "Child & Adolescent Care",
    branch: "AVSH Mumbai",
    experience: 9,
    status: "Available",
  },
  {
    id: "AVSH-102",
    name: "Dr. Riya Iyer",
    gender: "female",
    department: "Pediatrics",
    specialization: "Child & Adolescent Care",
    branch: "AVSH Mumbai",
    experience: 11,
    status: "Available",
  },
  {
    id: "AVSH-103",
    name: "Dr. Yash Malhotra",
    gender: "male",
    department: "Dermatology",
    specialization: "Clinical Dermatology",
    branch: "AVSH Mumbai",
    experience: 8,
    status: "Available",
  },
  {
    id: "AVSH-104",
    name: "Dr. Manav Iyer",
    gender: "male",
    department: "Dermatology",
    specialization: "Clinical Dermatology",
    branch: "AVSH Mumbai",
    experience: 10,
    status: "Available",
  },
  {
    id: "AVSH-105",
    name: "Dr. Aarush Khanna",
    gender: "male",
    department: "Dermatology",
    specialization: "Clinical Dermatology",
    branch: "AVSH Mumbai",
    experience: 12,
    status: "Available",
  },
  {
    id: "AVSH-106",
    name: "Dr. Rhea Iyer",
    gender: "female",
    department: "Gastroenterology",
    specialization: "Digestive Health",
    branch: "AVSH Mumbai",
    experience: 9,
    status: "Available",
  },
  {
    id: "AVSH-107",
    name: "Dr. Sana Khanna",
    gender: "female",
    department: "Gastroenterology",
    specialization: "Digestive Health",
    branch: "AVSH Mumbai",
    experience: 11,
    status: "Available",
  },
  {
    id: "AVSH-108",
    name: "Dr. Neha Nair",
    gender: "female",
    department: "Gastroenterology",
    specialization: "Digestive Health",
    branch: "AVSH Mumbai",
    experience: 13,
    status: "Available",
  },
  {
    id: "AVSH-109",
    name: "Dr. Nandini Khanna",
    gender: "female",
    department: "Gynecology & Obstetrics",
    specialization: "Women’s Health & Obstetrics",
    branch: "AVSH Mumbai",
    experience: 10,
    status: "Available",
  },
  {
    id: "AVSH-110",
    name: "Dr. Tanya Nair",
    gender: "female",
    department: "Gynecology & Obstetrics",
    specialization: "Women’s Health & Obstetrics",
    branch: "AVSH Mumbai",
    experience: 12,
    status: "Available",
  },
  {
    id: "AVSH-111",
    name: "Dr. Ishani Rao",
    gender: "female",
    department: "Gynecology & Obstetrics",
    specialization: "Women’s Health & Obstetrics",
    branch: "AVSH Mumbai",
    experience: 14,
    status: "Available",
  },
  {
    id: "AVSH-112",
    name: "Dr. Kiara Nair",
    gender: "female",
    department: "Ophthalmology",
    specialization: "Eye Care & Surgery",
    branch: "AVSH Mumbai",
    experience: 11,
    status: "Available",
  },
  {
    id: "AVSH-113",
    name: "Dr. Riya Rao",
    gender: "female",
    department: "Ophthalmology",
    specialization: "Eye Care & Surgery",
    branch: "AVSH Mumbai",
    experience: 13,
    status: "Available",
  },
  {
    id: "AVSH-114",
    name: "Dr. Maya Verma",
    gender: "female",
    department: "Ophthalmology",
    specialization: "Eye Care & Surgery",
    branch: "AVSH Mumbai",
    experience: 15,
    status: "Available",
  },
  {
    id: "AVSH-115",
    name: "Dr. Dhruv Rao",
    gender: "male",
    department: "Urology",
    specialization: "Urology & Endourology",
    branch: "AVSH Mumbai",
    experience: 12,
    status: "Available",
  },
  {
    id: "AVSH-116",
    name: "Dr. Kabir Verma",
    gender: "male",
    department: "Urology",
    specialization: "Urology & Endourology",
    branch: "AVSH Mumbai",
    experience: 14,
    status: "Available",
  },
  {
    id: "AVSH-117",
    name: "Dr. Ayaan Shah",
    gender: "male",
    department: "Urology",
    specialization: "Urology & Endourology",
    branch: "AVSH Mumbai",
    experience: 16,
    status: "Available",
  },
  {
    id: "AVSH-118",
    name: "Dr. Manav Verma",
    gender: "male",
    department: "General Medicine",
    specialization: "Internal Medicine",
    branch: "AVSH Mumbai",
    experience: 13,
    status: "Available",
  },
  {
    id: "AVSH-119",
    name: "Dr. Neil Shah",
    gender: "male",
    department: "General Medicine",
    specialization: "Internal Medicine",
    branch: "AVSH Mumbai",
    experience: 15,
    status: "Available",
  },
  {
    id: "AVSH-120",
    name: "Dr. Raghav Kapoor",
    gender: "male",
    department: "General Medicine",
    specialization: "Internal Medicine",
    branch: "AVSH Mumbai",
    experience: 17,
    status: "Available",
  },
];

const appointmentTimes = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
];

function getFutureDates() {
  const dates: {
    value: string;
    day: string;
    date: string;
    month: string;
  }[] = [];

  const formatterDay = new Intl.DateTimeFormat(
    "en-US",
    { weekday: "short" }
  );

  const formatterMonth = new Intl.DateTimeFormat(
    "en-US",
    { month: "short" }
  );

  for (let i = 0; i < 14; i++) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + i);

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    dates.push({
      value: `${year}-${month}-${day}`,
      day: formatterDay.format(date),
      date: String(date.getDate()),
      month: formatterMonth.format(date),
    });
  }

  return dates;
}

const availableDates = getFutureDates();

export default function PatientAppointmentsPage() {
  const router = useRouter();

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [selectedBranch, setSelectedBranch] =
    useState("AVSH Hyderabad");

  const [selectedDepartment, setSelectedDepartment] =
    useState("");

  const [selectedDoctorId, setSelectedDoctorId] =
    useState("");

  const [doctorLocked, setDoctorLocked] =
    useState(false);

  const [selectedDate, setSelectedDate] =
    useState(availableDates[0]?.value ?? "");

  const [selectedTime, setSelectedTime] =
    useState("");

  const [appointmentMode, setAppointmentMode] =
    useState<AppointmentMode>("Physical");

  const [search, setSearch] = useState("");

  const [branchOpen, setBranchOpen] =
    useState(false);

  const [departmentOpen, setDepartmentOpen] =
    useState(false);

  const [doctorOpen, setDoctorOpen] =
    useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedBranch = localStorage.getItem(
        SELECTED_BRANCH_KEY
      );

      let initialBranch = "AVSH Hyderabad";

      if (
        savedBranch &&
        branches.includes(savedBranch)
      ) {
        initialBranch = savedBranch;
        setSelectedBranch(savedBranch);
      }

      const savedDoctors = localStorage.getItem(
        DOCTORS_STORAGE_KEY
      );

      // The built-in AVSH doctor directory is the source of truth.
      // Saved doctors may contain older/incomplete data, so they are
      // merged only as additional records and can never replace the
      // complete branch-specific doctor list above.
      let loadedDoctors: Doctor[] = [...fallbackDoctors];

      if (savedDoctors) {
        const parsed = JSON.parse(savedDoctors);

        if (Array.isArray(parsed)) {
          for (const savedDoctor of parsed) {
            if (!savedDoctor?.name || !savedDoctor?.branch) continue;

            const alreadyExists = loadedDoctors.some(
              (doctor) =>
                String(doctor.id) === String(savedDoctor.id) ||
                (doctor.name === savedDoctor.name &&
                  doctor.branch === savedDoctor.branch)
            );

            if (!alreadyExists) {
              loadedDoctors.push(savedDoctor as Doctor);
            }
          }
        }
      }

      const selectedDoctorRaw = localStorage.getItem(
        "avshSelectedDoctor"
      );

      if (selectedDoctorRaw) {
        const selected = JSON.parse(selectedDoctorRaw);

        if (selected?.name && selected?.branch) {
          const normalizedSelected: Doctor = {
            id: String(selected.id ?? selected.name),
            name: selected.name,
            gender: selected.gender,
            department:
              selected.department ??
              selected.specialty ??
              "General Medicine",
            specialization:
              selected.specialization ??
              selected.specialty ??
              selected.department,
            branch: selected.branch,
            experience: selected.experience,
            status: selected.available === false
              ? "Busy"
              : selected.status ?? "Available",
          };

          const existingIndex = loadedDoctors.findIndex(
            (doctor) =>
              String(doctor.id) === normalizedSelected.id ||
              doctor.name === normalizedSelected.name
          );

          if (existingIndex === -1) {
            loadedDoctors = [
              ...loadedDoctors,
              normalizedSelected,
            ];
          } else {
            loadedDoctors = loadedDoctors.map(
              (doctor, index) =>
                index === existingIndex
                  ? { ...doctor, ...normalizedSelected }
                  : doctor
            );
          }

          setSelectedBranch(normalizedSelected.branch);
          localStorage.setItem(
            SELECTED_BRANCH_KEY,
            normalizedSelected.branch
          );
          setSelectedDepartment(normalizedSelected.department);
          setSelectedDoctorId(normalizedSelected.id);
          setDoctorLocked(true);
        }
      } else {
        setSelectedBranch(initialBranch);
      }

      setDoctors(loadedDoctors);
    } catch {
      setDoctors(fallbackDoctors);
    } finally {
      setLoading(false);
    }
  }, []);

  const branchDoctors = useMemo(() => {
    return doctors.filter(
      (doctor) =>
        doctor.branch === selectedBranch
    );
  }, [doctors, selectedBranch]);

  const departmentDoctors = useMemo(() => {
    if (!selectedDepartment) {
      return branchDoctors;
    }

    return branchDoctors.filter(
      (doctor) =>
        doctor.department === selectedDepartment
    );
  }, [
    branchDoctors,
    selectedDepartment,
  ]);

  const filteredDoctors = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return departmentDoctors;
    }

    return departmentDoctors.filter(
      (doctor) =>
        doctor.name
          .toLowerCase()
          .includes(query) ||
        doctor.department
          .toLowerCase()
          .includes(query) ||
        (
          doctor.specialization ??
          doctor.specialty ??
          ""
        )
          .toLowerCase()
          .includes(query)
    );
  }, [departmentDoctors, search]);

  const selectedDoctor = useMemo(() => {
    return doctors.find(
      (doctor) =>
        doctor.id === selectedDoctorId
    );
  }, [doctors, selectedDoctorId]);

  function changeBranch(branch: string) {
    setSelectedBranch(branch);

    localStorage.setItem(
      SELECTED_BRANCH_KEY,
      branch
    );

    setSelectedDepartment("");
    setSelectedDoctorId("");
    setSelectedTime("");
    setDoctorLocked(false);
    localStorage.removeItem("avshSelectedDoctor");
    setBranchOpen(false);
  }

  function changeDepartment(
    department: string
  ) {
    setSelectedDepartment(department);
    setSelectedDoctorId("");
    setSelectedTime("");
    setDoctorLocked(false);
    localStorage.removeItem("avshSelectedDoctor");
    setDepartmentOpen(false);
  }

  function chooseDoctor(doctor: Doctor) {
    setSelectedDoctorId(doctor.id);
    setSelectedTime("");
    setDoctorOpen(false);
  }

  function saveAppointment() {
    if (
      !selectedDoctor ||
      !selectedDate ||
      !selectedTime
    ) {
      return;
    }

    const appointment = {
      branch: selectedBranch,
      department:
        selectedDoctor.department,
      specialty:
        selectedDoctor.specialization ??
        selectedDoctor.specialty ??
        selectedDoctor.department,
      doctor: selectedDoctor.name,
      doctorId: selectedDoctor.id,
      date: selectedDate,
      time: selectedTime,
      mode: appointmentMode,
      purpose: "appointment",
    };

    localStorage.setItem(
      APPOINTMENT_STORAGE_KEY,
      JSON.stringify(appointment)
    );

    localStorage.setItem(
      SELECTED_BRANCH_KEY,
      selectedBranch
    );

    router.push("/patient/confirmation");
  }

  const canContinue =
    Boolean(
      selectedDoctor &&
        selectedDate &&
        selectedTime
    );

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-82px)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#E5E1D7] border-t-[#D4A84F]" />

          <p className="text-sm text-[#667085]">
            Loading AVSH doctors...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="border-b border-[#E5E1D7] bg-white">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/patient/dashboard"
              )
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#667085] transition hover:text-[#071A3D]"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9A7A32]">
                AVSH Healthcare
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Book an Appointment
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
                Choose your AVSH branch, department,
                doctor and preferred consultation time.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#E5E1D7] bg-[#F8F7F3] px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#9A7A32]">
                <Stethoscope size={19} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A7A32]">
                  Doctors at branch
                </p>

                <p className="text-sm font-black">
                  {branchDoctors.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN BOOKING AREA
      ===================================================== */}

      <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="min-w-0 space-y-6">
            {/* BRANCH + DEPARTMENT */}

            <section className="rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,61,0.04)] sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#9A7A32]">
                  Step 1
                </p>

                <h2 className="mt-1 text-lg font-black">
                  Choose your care location
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  Select the AVSH branch and medical
                  department you need.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* BRANCH */}

                <div className="relative">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#667085]">
                    AVSH Branch
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setBranchOpen(
                        (value) => !value
                      )
                    }
                    className="flex w-full items-center justify-between rounded-xl border border-[#E5E1D7] bg-white px-4 py-3.5 text-left transition hover:border-[#D4A84F]"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <MapPin
                        size={17}
                        className="shrink-0 text-[#9A7A32]"
                      />

                      <span className="truncate text-sm font-bold">
                        {selectedBranch}
                      </span>
                    </span>

                    <ChevronDown
                      size={17}
                      className={`shrink-0 text-[#667085] transition ${
                        branchOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {branchOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-20 overflow-hidden rounded-2xl border border-[#E5E1D7] bg-white p-2 shadow-2xl">
                      {branches.map((branch) => (
                        <button
                          key={branch}
                          type="button"
                          onClick={() =>
                            changeBranch(
                              branch
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                            branch ===
                            selectedBranch
                              ? "bg-[#071A3D] text-white"
                              : "hover:bg-[#F8F7F3]"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Building2
                              size={16}
                              className={
                                branch ===
                                selectedBranch
                                  ? "text-[#D4A84F]"
                                  : "text-[#9A7A32]"
                              }
                            />

                            <span className="text-sm font-semibold">
                              {branch}
                            </span>
                          </span>

                          {branch ===
                            selectedBranch && (
                            <Check
                              size={16}
                              className="text-[#D4A84F]"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* DEPARTMENT */}

                <div className="relative">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Department
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setDepartmentOpen(
                        (value) => !value
                      )
                    }
                    className="flex w-full items-center justify-between rounded-xl border border-[#E5E1D7] bg-white px-4 py-3.5 text-left transition hover:border-[#D4A84F]"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Stethoscope
                        size={17}
                        className="shrink-0 text-[#9A7A32]"
                      />

                      <span className="truncate text-sm font-bold">
                        {selectedDepartment ||
                          "All Departments"}
                      </span>
                    </span>

                    <ChevronDown
                      size={17}
                      className={`shrink-0 text-[#667085] transition ${
                        departmentOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {departmentOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-20 max-h-[360px] overflow-y-auto rounded-2xl border border-[#E5E1D7] bg-white p-2 shadow-2xl">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDepartment(
                            ""
                          );
                          setSelectedDoctorId("");
                          setSelectedTime("");
                          setDoctorLocked(false);
                          localStorage.removeItem(
                            "avshSelectedDoctor"
                          );
                          setDepartmentOpen(false);
                        }}
                        className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                          !selectedDepartment
                            ? "bg-[#071A3D] text-white"
                            : "hover:bg-[#F8F7F3]"
                        }`}
                      >
                        All Departments
                      </button>

                      {departments.map(
                        (department) => (
                          <button
                            key={department}
                            type="button"
                            onClick={() =>
                              changeDepartment(
                                department
                              )
                            }
                            className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                              selectedDepartment ===
                              department
                                ? "bg-[#071A3D] text-white"
                                : "hover:bg-[#F8F7F3]"
                            }`}
                          >
                            {department}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* DOCTORS */}

            <section className="rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,61,0.04)] sm:p-6">
              {doctorLocked && selectedDoctor ? (
                <>
                  <div className="mb-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#9A7A32]">
                      Step 2
                    </p>

                    <h2 className="mt-1 text-lg font-black">
                      Selected doctor
                    </h2>

                    <p className="mt-1 text-sm text-[#667085]">
                      You selected this doctor from the AVSH Doctor Directory.
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#D4A84F] bg-[#F8F7F3] p-5 ring-1 ring-[#D4A84F]">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#071A3D] text-[#D4A84F]">
                        <Stethoscope size={23} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-black">
                            {selectedDoctor.name}
                          </p>

                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Available
                          </span>
                        </div>

                        <p className="mt-1 text-xs font-semibold text-[#667085]">
                          {selectedDoctor.department}
                        </p>

                        <p className="mt-1 text-xs text-[#9A7A32]">
                          {selectedDoctor.specialization ??
                            selectedDoctor.specialty ??
                            "Specialist"}
                        </p>

                        <p className="mt-2 text-[10px] font-semibold text-[#667085]">
                          {selectedDoctor.branch}
                          {selectedDoctor.experience !== undefined
                            ? ` • ${selectedDoctor.experience}+ yrs experience`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="hidden shrink-0 items-center gap-2 rounded-full bg-[#071A3D] px-3 py-2 text-[10px] font-bold text-white sm:flex">
                      <Check size={14} className="text-[#D4A84F]" />
                      Selected
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#9A7A32]">
                        Step 2
                      </p>

                      <h2 className="mt-1 text-lg font-black">
                        Select a doctor
                      </h2>

                      <p className="mt-1 text-sm text-[#667085]">
                        {selectedDepartment
                          ? `${selectedDepartment} doctors at ${selectedBranch}`
                          : `Doctors available at ${selectedBranch}`}
                      </p>
                    </div>

                    <div className="relative w-full sm:w-[270px]">
                      <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                      />

                      <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                          setSearch(event.target.value)
                        }
                        placeholder="Search doctors..."
                        className="w-full rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-[#98A2B3] focus:border-[#D4A84F] focus:bg-white"
                      />
                    </div>
                  </div>

                  {filteredDoctors.length > 0 ? (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {filteredDoctors
                        .slice(0, 12)
                        .map((doctor) => {
                          const active =
                            selectedDoctorId === doctor.id;

                          return (
                            <button
                              type="button"
                              key={doctor.id}
                              onClick={() => chooseDoctor(doctor)}
                              className={`group flex min-w-0 items-center gap-4 rounded-2xl border p-4 text-left transition ${
                                active
                                  ? "border-[#D4A84F] bg-[#F8F7F3] ring-1 ring-[#D4A84F]"
                                  : "border-[#E5E1D7] bg-white hover:border-[#D4A84F] hover:shadow-md"
                              }`}
                            >
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#E5E1D7] bg-[#071A3D] text-[#D4A84F]">
                                <Stethoscope size={24} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="truncate text-sm font-black">
                                    {doctor.name}
                                  </p>

                                  {active && (
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D4A84F] text-[#071A3D]">
                                      <Check size={14} />
                                    </span>
                                  )}
                                </div>

                                <p className="mt-1 truncate text-xs font-semibold text-[#667085]">
                                  {doctor.department}
                                </p>

                                <p className="mt-1 truncate text-xs text-[#9A7A32]">
                                  {doctor.specialization ??
                                    doctor.specialty ??
                                    "Specialist"}
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  {doctor.experience !== undefined && (
                                    <span className="text-[10px] font-semibold text-[#667085]">
                                      {doctor.experience}+ yrs experience
                                    </span>
                                  )}

                                  <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${
                                    doctor.status === "Available"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : doctor.status === "Busy"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}>
                                    {doctor.status ?? "Available"}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-dashed border-[#E5E1D7] bg-[#F8F7F3] px-6 py-12 text-center">
                      <Search
                        size={28}
                        className="mx-auto text-[#98A2B3]"
                      />

                      <h3 className="mt-3 text-sm font-black">
                        No doctors found
                      </h3>

                      <p className="mt-1 text-xs text-[#667085]">
                        Try another department, search term or AVSH branch.
                      </p>
                    </div>
                  )}

                  {filteredDoctors.length > 12 && (
                    <p className="mt-4 text-center text-xs text-[#667085]">
                      Showing the first 12 matching doctors. Use the search box to find a specific doctor.
                    </p>
                  )}
                </>
              )}
            </section>

            {/* DATE */}

            <section className="rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,61,0.04)] sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#9A7A32]">
                  Step 3
                </p>

                <h2 className="mt-1 text-lg font-black">
                  Choose date
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  Select your preferred appointment
                  date.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
                {availableDates.map((date) => {
                  const active =
                    selectedDate ===
                    date.value;

                  return (
                    <button
                      key={date.value}
                      type="button"
                      onClick={() => {
                        setSelectedDate(
                          date.value
                        );
                        setSelectedTime("");
                      }}
                      className={`rounded-xl border px-2 py-3 text-center transition ${
                        active
                          ? "border-[#071A3D] bg-[#071A3D] text-white"
                          : "border-[#E5E1D7] hover:border-[#D4A84F] hover:bg-[#F8F7F3]"
                      }`}
                    >
                      <p
                        className={`text-[10px] font-bold uppercase ${
                          active
                            ? "text-[#F1D58A]"
                            : "text-[#667085]"
                        }`}
                      >
                        {date.day}
                      </p>

                      <p className="mt-1 text-xl font-black">
                        {date.date}
                      </p>

                      <p
                        className={`text-[10px] font-semibold ${
                          active
                            ? "text-white/60"
                            : "text-[#98A2B3]"
                        }`}
                      >
                        {date.month}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* TIME */}

            <section className="rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,61,0.04)] sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#9A7A32]">
                  Step 4
                </p>

                <h2 className="mt-1 text-lg font-black">
                  Choose time
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  Select an available consultation
                  slot.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {appointmentTimes.map(
                  (time) => {
                    const active =
                      selectedTime === time;

                    return (
                      <button
                        type="button"
                        key={time}
                        onClick={() =>
                          setSelectedTime(
                            time
                          )
                        }
                        className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition ${
                          active
                            ? "border-[#071A3D] bg-[#071A3D] text-white"
                            : "border-[#E5E1D7] hover:border-[#D4A84F] hover:bg-[#F8F7F3]"
                        }`}
                      >
                        <Clock3
                          size={15}
                          className={
                            active
                              ? "text-[#D4A84F]"
                              : "text-[#9A7A32]"
                          }
                        />

                        {time}
                      </button>
                    );
                  }
                )}
              </div>
            </section>

            {/* CONSULTATION MODE */}

            <section className="rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,61,0.04)] sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#9A7A32]">
                  Step 5
                </p>

                <h2 className="mt-1 text-lg font-black">
                  Consultation type
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  Choose how you would like to meet
                  your doctor.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setAppointmentMode(
                      "Physical"
                    )
                  }
                  className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition ${
                    appointmentMode ===
                    "Physical"
                      ? "border-[#D4A84F] bg-[#F8F7F3] ring-1 ring-[#D4A84F]"
                      : "border-[#E5E1D7] hover:border-[#D4A84F]"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      appointmentMode ===
                      "Physical"
                        ? "bg-[#071A3D] text-white"
                        : "bg-[#F8F7F3] text-[#9A7A32]"
                    }`}
                  >
                    <Stethoscope size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-black">
                      Physical Appointment
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#667085]">
                      Visit the selected AVSH branch
                      and meet your doctor in person.
                    </p>
                  </div>

                  {appointmentMode ===
                    "Physical" && (
                    <Check
                      size={18}
                      className="ml-auto shrink-0 text-[#9A7A32]"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setAppointmentMode(
                      "Video Consult"
                    )
                  }
                  className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition ${
                    appointmentMode ===
                    "Video Consult"
                      ? "border-[#D4A84F] bg-[#F8F7F3] ring-1 ring-[#D4A84F]"
                      : "border-[#E5E1D7] hover:border-[#D4A84F]"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      appointmentMode ===
                      "Video Consult"
                        ? "bg-[#071A3D] text-white"
                        : "bg-[#F8F7F3] text-[#9A7A32]"
                    }`}
                  >
                    <Video size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-black">
                      Video Consultation
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#667085]">
                      Connect securely with your doctor
                      online from wherever you are.
                    </p>
                  </div>

                  {appointmentMode ===
                    "Video Consult" && (
                    <Check
                      size={18}
                      className="ml-auto shrink-0 text-[#9A7A32]"
                    />
                  )}
                </button>
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT SUMMARY
          ================================================= */}

          <aside className="xl:sticky xl:top-[106px] xl:self-start">
            <div className="overflow-hidden rounded-2xl border border-[#E5E1D7] bg-white shadow-[0_8px_30px_rgba(7,26,61,0.06)]">
              <div className="bg-[#071A3D] px-5 py-5 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-[#D4A84F]">
                  Appointment Summary
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Review your booking
                </h2>
              </div>

              <div className="space-y-5 p-5">
                {/* DOCTOR */}

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A7A32]">
                    Doctor
                  </p>

                  {selectedDoctor ? (
                    <div className="mt-3 rounded-xl bg-[#F8F7F3] p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#071A3D] text-[#D4A84F]">
                          <Check size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-black">
                            {selectedDoctor.name}
                          </p>

                          <p className="truncate text-xs text-[#667085]">
                            {selectedDoctor.department}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-[#98A2B3]">
                      No doctor selected
                    </p>
                  )}
                </div>

                <div className="h-px bg-[#E5E1D7]" />

                {/* DETAILS */}

                <div className="space-y-4">
                  <SummaryRow
                    icon={Building2}
                    label="Branch"
                    value={selectedBranch}
                  />

                  <SummaryRow
                    icon={Stethoscope}
                    label="Department"
                    value={
                      selectedDoctor?.department ??
                      selectedDepartment ??
                      "Not selected"
                    }
                  />

                  <SummaryRow
                    icon={CalendarDays}
                    label="Date"
                    value={
                      selectedDate
                        ? formatDate(
                            selectedDate
                          )
                        : "Not selected"
                    }
                  />

                  <SummaryRow
                    icon={Clock3}
                    label="Time"
                    value={
                      selectedTime ||
                      "Not selected"
                    }
                  />

                  <SummaryRow
                    icon={
                      appointmentMode ===
                      "Physical"
                        ? Stethoscope
                        : Video
                    }
                    label="Mode"
                    value={appointmentMode}
                  />
                </div>

                <div className="rounded-xl bg-[#F8F7F3] p-4">
                  <p className="text-xs font-bold text-[#071A3D]">
                    Before you continue
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#667085]">
                    Please review your doctor, date,
                    time and consultation mode before
                    confirming the appointment.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={saveAppointment}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-black transition ${
                    canContinue
                      ? "bg-[#071A3D] text-white hover:bg-[#102A56]"
                      : "cursor-not-allowed bg-[#E5E1D7] text-[#98A2B3]"
                  }`}
                >
                  Continue to Confirmation
                  <ArrowRight size={17} />
                </button>

                {!canContinue && (
                  <p className="text-center text-[11px] text-[#98A2B3]">
                    Select a doctor, date and time to
                    continue.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F8F7F3] text-[#9A7A32]">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
          {label}
        </p>

        <p className="mt-0.5 break-words text-sm font-bold text-[#071A3D]">
          {value}
        </p>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(
    `${value}T00:00:00`
  );

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}