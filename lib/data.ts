import { Decimal } from "./generated/prisma/runtime/library";

export type Car = {
    id: string;
    make: string;
    model: string;
    year: number;
    price: Decimal;
    images: string[];
    transmission: string;
    fuelType: string;
    bodyType: string;
    mileage: number;
    color: string;
    featured: boolean;
  };
  
  export type CarMake = {
    id: number;
    name: string;
    image: string;
  };
  
  export type BodyType = {
    id: number;
    name: string;
    image: string;
  };
  
  export type FAQItem = {
    question: string;
    answer: string;
  };

  
  export const carMakes: CarMake[] = [
    { id: 1, name: "Hyundai", image: "/make/hyundai.webp" },
    { id: 2, name: "Honda", image: "/make/honda.webp" },
    { id: 3, name: "BMW", image: "/make/bmw.webp" },
    { id: 4, name: "Tata", image: "/make/tata.webp" },
    { id: 5, name: "Mahindra", image: "/make/mahindra.webp" },
    { id: 6, name: "Ford", image: "/make/ford.webp" },
  ];
  
  export const bodyTypes: BodyType[] = [
    { id: 1, name: "SUV", image: "/body/suv.webp" },
    { id: 2, name: "Sedan", image: "/body/sedan.webp" },
    { id: 3, name: "Hatchback", image: "/body/hatchback.webp" },
    { id: 4, name: "Convertible", image: "/body/convertible.webp" },
  ];
  
  export const faqItems: FAQItem[] = [
    {
      question: "How does the test drive booking work?",
      answer:
        "Simply find a car you're interested in, click the 'Test Drive' button, and select an available time slot. Our system will confirm your booking and provide all necessary details.",
    },
    {
      question: "Can I search for cars using an image?",
      answer:
        "Yes! Our AI-powered image search lets you upload a photo of a car you like, and we'll find similar models in our inventory.",
    },
    {
      question: "Are all cars certified and verified?",
      answer:
        "All cars listed on our platform undergo a verification process. We are trusted dealerships and verified private sellers.",
    },
    {
      question: "What happens after I book a test drive?",
      answer:
        "After booking, you'll receive a confirmation email with all the details. We will also contact you to confirm and provide any additional information.",
    },
  ];
  