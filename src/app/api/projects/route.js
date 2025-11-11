export async function GET() {
  const projects = [
    {
      id: 1,
      slug: "epikcart",
      title: "Epikcart",
      year: "2023",
      tech: [
        "React",
        "Redux",
        "React i18n",
        "Tailwind CSS",
        "Framer Motion",
        "Debouncing",
        "API Integration",
      ],
      description:
        "Epikcart is a feature-rich, scalable e-commerce platform tailored for large businesses. It features dynamic product filtering, multi-language support with RTL, advanced inventory management, order tracking, and refund systems, offering a comprehensive solution for multi-vendor operations.",
      myRole: [
        "Built the frontend from scratch using React, Redux, RTK Query, and Tailwind CSS.",
        "Developed dynamic filtering logic for the product search page with admin-configurable parameters.",
        "Integrated multi-language support with React i18n, including RTL handling.",
        "Delivered a responsive, user-friendly interface in collaboration with the UI/UX designer.",
      ],
      images: [
        "/projects/epikcart-1.png",
        "/projects/epikcart-2.png",
        "/projects/epikcart-3.png",
      ],
      hoverImage: "/Services/docker.svg",
      liveUrl: "https://epikcart.vercel.app",
      github: "https://github.com/yourusername/epikcart",
    },
    {
      id: 2,
      slug: "epikcart",
      title: "Epikcart",
      year: "2023",
      tech: [
        "React",
        "Redux",
        "React i18n",
        "Tailwind CSS",
        "Framer Motion",
        "Debouncing",
        "API Integration",
      ],
      description:
        "Epikcart is a feature-rich, scalable e-commerce platform tailored for large businesses. It features dynamic product filtering, multi-language support with RTL, advanced inventory management, order tracking, and refund systems, offering a comprehensive solution for multi-vendor operations.",
      myRole: [
        "Built the frontend from scratch using React, Redux, RTK Query, and Tailwind CSS.",
        "Developed dynamic filtering logic for the product search page with admin-configurable parameters.",
        "Integrated multi-language support with React i18n, including RTL handling.",
        "Delivered a responsive, user-friendly interface in collaboration with the UI/UX designer.",
      ],
      images: [
        "/projects/epikcart-1.png",
        "/projects/epikcart-2.png",
        "/projects/epikcart-3.png",
      ],
      hoverImage: "/Services/figma.png",
      liveUrl: "https://epikcart.vercel.app",
      github: "https://github.com/yourusername/epikcart",
    },
    {
      id: 3,
      slug: "epikcart",
      title: "Epikcart",
      year: "2023",
      tech: [
        "React",
        "Redux",
        "React i18n",
        "Tailwind CSS",
        "Framer Motion",
        "Debouncing",
        "API Integration",
      ],
      description:
        "Epikcart is a feature-rich, scalable e-commerce platform tailored for large businesses. It features dynamic product filtering, multi-language support with RTL, advanced inventory management, order tracking, and refund systems, offering a comprehensive solution for multi-vendor operations.",
      myRole: [
        "Built the frontend from scratch using React, Redux, RTK Query, and Tailwind CSS.",
        "Developed dynamic filtering logic for the product search page with admin-configurable parameters.",
        "Integrated multi-language support with React i18n, including RTL handling.",
        "Delivered a responsive, user-friendly interface in collaboration with the UI/UX designer.",
      ],
      images: [
        "/projects/epikcart-1.png",
        "/projects/epikcart-2.png",
        "/projects/epikcart-3.png",
      ],
      hoverImage: "/Services/gsap.png",
      liveUrl: "https://epikcart.vercel.app",
      github: "https://github.com/yourusername/epikcart",
    },
  ];

  return Response.json(projects);
}
