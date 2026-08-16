import React, { useState, useEffect, useRef } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import logo from "./assets/codeecho_logo.png";
import { Helmet } from "react-helmet-async";
import toast, { Toaster } from "react-hot-toast";
import {
  Moon,
  Sun,
  Search,
  Globe,
  Smartphone,
  Code,
  TrendingUp,
  Share2,
  Server,
  Send,
  CheckCircle,
  Lightbulb,
  PenTool,
  Rocket,
  Star,
  Phone,
  Mail,
  MessageCircle,
  Menu,
  X,
  ArrowUp,
  // New icons for the portfolio section
  Layers,
  ShoppingCart,
  ShieldCheck,
  Activity,
  MessageSquare,
} from "lucide-react";

import { motion, useScroll, useTransform } from "framer-motion";

// --- Reusable Scroll Reveal Component ---
const RevealOnScroll = ({ children, delay = 0, direction = "up" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  let hiddenClass = "translate-y-12";
  if (direction === "left") hiddenClass = "-translate-x-16";
  if (direction === "right") hiddenClass = "translate-x-16";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 translate-x-0"
          : `opacity-0 ${hiddenClass}`
      }`}
    >
      {children}
    </div>
  );
};

const CodeEchoPage = () => {
  // 1. Initialize state by checking localStorage OR the user's system preferences
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("codeEchoTheme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return true;
    }
    return false;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  // --- HORIZONTAL SCROLL REFS ---
  const processTargetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: processTargetRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  // 2. Update the DOM and save to localStorage whenever darkMode changes
  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");

    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("codeEchoTheme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("codeEchoTheme", "light");
    }
  }, [darkMode]);

  // --- Scroll Spy & Back to Top Logic ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      const sections = document.querySelectorAll("section[id]");
      let currentSection = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          currentSection = section.getAttribute("id");
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("sending...");
    const loadingToast = toast.loading("Sending message...");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "9c96c8e8-40bc-4231-b7cd-c6ddce9930b9",
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Project Inquiry from ${formData.name}`,
          from_name: "Code Echo Portal",
        }),
      });

      if (response.ok) {
        toast.success("Message sent successfully!", { id: loadingToast });
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send. Try again.", { id: loadingToast });
        setSubmitStatus("error");
      }
    } catch (error) {
      toast.error("Network error. Try again later.", { id: loadingToast });
      setSubmitStatus("error");
    }

    setTimeout(() => setSubmitStatus(null), 3000);
  };

  const handleSeoSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Sending request...");
    const formData = new FormData(e.target);
    const website = formData.get("website");
    const email = formData.get("email");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "9c96c8e8-40bc-4231-b7cd-c6ddce9930b9",
          subject: `New SEO Audit Request: ${website}`,
          email: email,
          message: `You have a new SEO Audit Request!\n\nWebsite to audit: ${website}\nSend the report to: ${email}`,
          from_name: "Code Echo SEO Lead",
        }),
      });

      if (response.ok) {
        toast.success("Audit request received! We'll email you shortly.", {
          id: loadingToast,
        });
        e.target.reset();
      } else {
        toast.error("Failed to send request. Try again.", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Network error. Try again later.", { id: loadingToast });
    }
  };

  // --- Data Arrays ---
  const services = [
    {
      title: "Web Development",
      desc: "Custom, responsive, and high-performance websites built from scratch to convert your visitors into clients.",
      icon: <Globe size={28} />,
    },
    {
      title: "App Development",
      desc: "Sleek, intuitive mobile applications for both iOS and Android tailored exactly to your business needs.",
      icon: <Smartphone size={28} />,
    },
    {
      title: "Personalized Software",
      desc: "Bespoke software solutions engineered to streamline your unique business operations and workflows.",
      icon: <Code size={28} />,
    },
    {
      title: "API Development",
      desc: "Robust and secure backend API architecture to ensure seamless data flow between your platforms.",
      icon: <Server size={28} />,
    },
    {
      title: "SEO Optimization",
      desc: "Data-driven strategies to rank your website higher on search engines and drive organic traffic.",
      icon: <Search size={28} />,
    },
    {
      title: "Digital Marketing",
      desc: "Comprehensive digital campaigns designed to maximize your ROI and expand your brand reach.",
      icon: <TrendingUp size={28} />,
    },
    {
      title: "Social Media Handling",
      desc: "Engaging content creation and community management to build your brand identity online.",
      icon: <Share2 size={28} />,
    },
  ];

  const portfolioProjects = [
    {
      category: "Web Development",
      title: "AuraShop",
      desc: "A responsive e-commerce frontend featuring dynamic cart logic, local storage management, and seamless hover UI effects.",
      tech: ["React", "Tailwind CSS", "JavaScript"],
      gradient:
        "from-cyan-200 to-blue-200 dark:from-cyan-900/40 dark:to-blue-900/40",
      icon: (
        <ShoppingCart size={48} className="text-blue-500 dark:text-blue-400" />
      ),
    },
    {
      category: "Full-Stack App",
      title: "Ag Sahara Platform",
      desc: "A travel lead-generation platform featuring automated real-time Telegram bot notifications and secure API routing.",
      tech: ["React", "Node.js", "Telegram API"],
      gradient:
        "from-pink-200 to-rose-200 dark:from-pink-900/40 dark:to-rose-900/40",
      icon: <Globe size={48} className="text-rose-500 dark:text-rose-400" />,
    },
    {
      category: "Web Development",
      title: "SaaS Analytics Dashboard",
      desc: "A complete MERN stack enterprise dashboard for managing user datasets, tracking metrics, and visual data representation.",
      tech: ["MongoDB", "Express", "React", "Node.js"],
      gradient:
        "from-orange-200 to-amber-200 dark:from-orange-900/40 dark:to-amber-900/40",
      icon: (
        <Activity size={48} className="text-amber-500 dark:text-amber-400" />
      ),
    },
    {
      category: "Cybersecurity",
      title: "Vulnerability Scanner",
      desc: "An automated web application penetration testing tool designed to identify common security flaws and data vulnerabilities.",
      tech: ["Python", "React", "REST API"],
      gradient:
        "from-emerald-200 to-teal-200 dark:from-emerald-900/40 dark:to-teal-900/40",
      icon: (
        <ShieldCheck size={48} className="text-teal-500 dark:text-teal-400" />
      ),
    },
    {
      category: "Mobile App",
      title: "Real-time Chat Application",
      desc: "A secure messaging application featuring real-time socket connections, user authentication, and media sharing.",
      tech: ["React Native", "Socket.io", "Firebase"],
      gradient:
        "from-purple-200 to-indigo-200 dark:from-purple-900/40 dark:to-indigo-900/40",
      icon: (
        <MessageSquare
          size={48}
          className="text-indigo-500 dark:text-indigo-400"
        />
      ),
    },
    {
      category: "DevOps",
      title: "Automated Deployment Pipeline",
      desc: "A CI/CD solution for migrating legacy applications to modern cloud platforms using containerization.",
      tech: ["Docker", "GitHub Actions", "AWS"],
      gradient:
        "from-blue-200 to-indigo-200 dark:from-blue-900/40 dark:to-indigo-900/40",
      icon: <Layers size={48} className="text-blue-500 dark:text-blue-400" />,
    },
  ];

  const processes = [
    {
      step: "01",
      title: "Discovery & Strategy",
      desc: "We start by understanding your goals, target audience, and technical requirements.",
      icon: <Lightbulb size={32} />,
    },
    {
      step: "02",
      title: "Design & Prototyping",
      desc: "Creating wireframes and visual designs to ensure the user experience aligns with your brand.",
      icon: <PenTool size={32} />,
    },
    {
      step: "03",
      title: "Development",
      desc: "Our team writes clean, scalable code using modern frameworks to bring the designs to life.",
      icon: <Code size={32} />,
    },
    {
      step: "04",
      title: "Testing & Launch",
      desc: "Rigorous quality assurance before deploying your project to live servers for the world to see.",
      icon: <Rocket size={32} />,
    },
  ];

  const pricingPlans = [
    {
      title: "Basic Profile",
      price: "₹14,999",
      desc: "Perfect for small businesses establishing their online presence.",
      features: [
        "Responsive Single Page Website",
        "Basic SEO Setup",
        "Contact Form Integration",
        "Mobile Optimized",
        "1 Month Free Support",
      ],
      isPopular: false,
    },
    {
      title: "Business Growth",
      price: "₹34,999",
      desc: "Comprehensive solution for growing businesses needing custom features.",
      features: [
        "Up to 10 Pages",
        "Advanced SEO Optimization",
        "Custom UI/UX Design",
        "CMS Integration (Blog)",
        "3 Months Free Support",
      ],
      isPopular: true,
    },
    {
      title: "Custom E-Commerce",
      price: "Custom",
      desc: "Full-scale application tailored to complex business requirements.",
      features: [
        "Unlimited Pages/Products",
        "Payment Gateway Integration",
        "Admin Dashboard",
        "API Integrations",
        "Priority 24/7 Support",
      ],
      isPopular: false,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Startup Founder",
      text: "Code Echo completely transformed our online presence. The custom web app they built is flawless and our user engagement has skyrocketed.",
    },
    {
      name: "Rahul Mehta",
      role: "Marketing Director",
      text: "Their SEO and digital marketing strategies are top-tier. We saw a 40% increase in organic traffic within the first three months of working together.",
    },
    {
      name: "Elena Rostova",
      role: "E-commerce Owner",
      text: "Professional, communicative, and technically brilliant. They handled our API integrations perfectly. Highly recommended for any serious business.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-x-clip font-sans">
      <Helmet>
        <title>
          Code Echo | Best IT Company in Nagpur | Web & App Development
        </title>
        <meta
          name="description"
          content="Code Echo is a top IT company in Nagpur specializing in custom web development, intuitive mobile apps, and results-driven digital marketing."
        />
      </Helmet>

      <Toaster position="bottom-center" reverseOrder={false} />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-yellow-400/20 dark:bg-yellow-400/10 rounded-full blur-[80px] animate-[pulse_6s_infinite_alternate]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-gray-400/20 dark:bg-blue-500/10 rounded-full blur-[80px] animate-[pulse_8s_infinite_alternate_reverse]"></div>
      </div>

      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={scrollToTop}
          >
            <img
              src={logo}
              alt="Code Echo Logo"
              className="h-12 md:h-14 w-auto"
            />
            <div className="text-2xl md:text-3xl font-bold tracking-tighter">
              Code <span className="font-mono text-yellow-500">Echo</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex gap-6 font-semibold">
              <a
                href="#about"
                className={`transition-colors ${activeSection === "about" ? "text-yellow-500" : "hover:text-yellow-500"}`}
              >
                About
              </a>
              <a
                href="#services"
                className={`transition-colors ${activeSection === "services" ? "text-yellow-500" : "hover:text-yellow-500"}`}
              >
                Services
              </a>
              <a
                href="#portfolio"
                className={`transition-colors ${activeSection === "portfolio" ? "text-yellow-500" : "hover:text-yellow-500"}`}
              >
                Portfolio
              </a>
              <a
                href="#process"
                className={`transition-colors ${activeSection === "process" ? "text-yellow-500" : "hover:text-yellow-500"}`}
              >
                Process
              </a>
              <a
                href="#pricing"
                className={`transition-colors ${activeSection === "pricing" ? "text-yellow-500" : "hover:text-yellow-500"}`}
              >
                Pricing
              </a>
              <a
                href="#contact"
                className={`transition-colors ${activeSection === "contact" ? "text-yellow-500" : "hover:text-yellow-500"}`}
              >
                Contact
              </a>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-yellow-400 hover:scale-110 transition-transform"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              className="md:hidden p-2 text-gray-800 dark:text-gray-200 hover:text-yellow-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex flex-col items-center py-6 gap-6 shadow-xl font-semibold transition-all">
            {[
              "about",
              "services",
              "portfolio",
              "process",
              "pricing",
              "contact",
            ].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg transition-colors capitalize ${activeSection === section ? "text-yellow-500" : "hover:text-yellow-500"}`}
              >
                {section}
              </a>
            ))}
          </div>
        )}
      </header>

      <header className="container mx-auto px-6 pt-32 pb-24 md:pt-48 md:pb-40 flex flex-col items-center justify-center text-center gap-6 relative z-10">
        <RevealOnScroll delay={0}>
          <h2 className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300">
            Transforming Ideas into Digital Reality.
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={150}>
          <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            Get Online With a <span className="text-yellow-500">Website</span>{" "}
            <br className="hidden md:block" /> That Works For You.
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={300}>
          <h3 className="text-2xl md:text-3xl font-mono font-bold text-yellow-500 mt-2">
            [where innovation starts]
          </h3>
        </RevealOnScroll>
        <RevealOnScroll delay={450}>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl">
            Code Echo is your all-in-one digital partner. From custom web
            development and app creation to strategic marketing, we build
            solutions that accelerate your growth.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={600}>
          <div className="pt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="inline-block px-8 py-4 bg-white dark:bg-gray-800 text-black dark:text-white font-bold rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#FBBF24] hover:shadow-[6px_6px_0px_0px_#FBBF24] hover:-translate-y-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_#FBBF24] transition-all"
            >
              Start Your Project
            </a>
            <a
              href="#portfolio"
              className="inline-block px-8 py-4 bg-transparent text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
            >
              Explore Work
            </a>
          </div>
        </RevealOnScroll>
      </header>

      <section
        id="about"
        className="container mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800"
      >
        <RevealOnScroll>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Who We Are</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              At Code Echo, we bridge the gap between innovative ideas and
              functional technology. We are a dedicated team of developers,
              designers, and marketers committed to building high-quality
              digital assets. Whether you are a startup needing a scalable app,
              an established company looking to optimize SEO, or a business
              ready to dominate social media, we deliver results that matter.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-4 py-2 rounded-full">
                <CheckCircle size={20} /> End-to-End Solutions
              </div>
              <div className="flex items-center gap-2 font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-4 py-2 rounded-full">
                <CheckCircle size={20} /> Modern Tech Stack
              </div>
              <div className="flex items-center gap-2 font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-4 py-2 rounded-full">
                <CheckCircle size={20} /> Results Driven
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section
        id="services"
        className="container mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800"
      >
        <RevealOnScroll>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Services That We Offer
          </h2>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <RevealOnScroll key={index} delay={index * 100}>
              <div className="group bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-2xl p-8 flex flex-col gap-4 shadow-[4px_4px_0px_0px_#FBBF24] hover:shadow-[8px_8px_0px_0px_#FBBF24] hover:-translate-y-2 transition-all cursor-pointer h-full">
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-800 dark:text-gray-200 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                  {service.icon}
                </div>
                <h3 className="font-bold text-xl">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* --- NEW PORTFOLIO SECTION --- */}
      <section
        id="portfolio"
        className="container mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800"
      >
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our Recent Work
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Explore some of the recent digital experiences we've engineered
              for our clients.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects.map((project, index) => (
            <RevealOnScroll key={index} delay={index * 100}>
              <div className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                <div
                  className={`h-48 bg-gradient-to-br ${project.gradient} w-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
                >
                  {project.icon}
                </div>
                <div className="p-8 flex flex-col flex-1 bg-white dark:bg-gray-800 z-10">
                  <span className="text-xs font-bold text-yellow-500 dark:text-yellow-400 mb-3 tracking-wide uppercase">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold text-gray-600 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <div id="process">
        <div className="block lg:hidden">
          <section
            ref={processTargetRef}
            className="relative h-[400vh] bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="sticky top-0 h-[100dvh] w-full flex flex-col justify-center items-start overflow-hidden">
              <h2 className="absolute top-24 md:top-32 w-full text-4xl font-bold text-center z-20">
                How We Work
              </h2>
              <motion.div
                style={{ x }}
                className="flex w-[400vw] h-full items-center pt-16"
              >
                {processes.map((proc, index) => (
                  <div
                    key={index}
                    className="w-screen flex-shrink-0 flex items-center justify-center px-6"
                  >
                    <div className="relative flex flex-col items-center text-center gap-6 group hover:-translate-y-2 transition-transform duration-300 w-full max-w-sm">
                      <div className="text-[8rem] font-mono font-bold text-gray-200 dark:text-gray-800 absolute -top-12 -z-10 transition-colors duration-300">
                        {proc.step}
                      </div>
                      <div className="w-20 h-20 bg-yellow-400 text-black rounded-2xl border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                        {proc.icon}
                      </div>
                      <h3 className="font-bold text-2xl mt-4 text-yellow-500">
                        {proc.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                        {proc.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>
        </div>

        <div className="hidden lg:block">
          <section className="container mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800 overflow-hidden">
            <RevealOnScroll>
              <h2 className="text-5xl font-bold text-center mb-20">
                How We Work
              </h2>
            </RevealOnScroll>
            <div className="grid grid-cols-4 gap-12 relative">
              {processes.map((proc, index) => (
                <RevealOnScroll
                  key={index}
                  delay={index * 150}
                  direction="left"
                >
                  <div className="relative flex flex-col gap-4 group hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
                    {index < processes.length - 1 && (
                      <div className="absolute top-8 -right-8 w-10 border-t-4 border-dotted border-yellow-400 z-0">
                        <div className="absolute -top-[10px] -right-2 w-4 h-4 border-t-4 border-r-4 border-yellow-400 transform rotate-45"></div>
                      </div>
                    )}
                    <div className="text-6xl font-mono font-bold text-gray-200 dark:text-gray-800 absolute -top-8 -left-4 -z-10 group-hover:text-yellow-200 dark:group-hover:text-yellow-900/30 transition-colors duration-300">
                      {proc.step}
                    </div>
                    <div className="w-16 h-16 bg-yellow-400 text-black rounded-xl border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] group-hover:bg-yellow-300 transition-colors relative z-10">
                      {proc.icon}
                    </div>
                    <h3 className="font-bold text-xl mt-2 group-hover:text-yellow-500 transition-colors">
                      {proc.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {proc.desc}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section
        id="pricing"
        className="container mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800"
      >
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Choose the package that aligns with your business goals. No hidden
              fees.
            </p>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <RevealOnScroll key={index} delay={index * 150}>
              <div
                className={`relative flex flex-col p-8 rounded-3xl border-2 transition-all duration-300 h-full ${plan.isPopular ? "bg-yellow-400 text-black border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 scale-105 z-10" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-yellow-400 shadow-lg hover:shadow-[8px_8px_0px_0px_#FBBF24] hover:-translate-y-2"}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                <p
                  className={`text-sm mb-6 ${plan.isPopular ? "text-gray-800" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {plan.desc}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                </div>
                <ul className="flex flex-col gap-4 flex-1 mb-8">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm font-medium"
                    >
                      <CheckCircle
                        size={18}
                        className={
                          plan.isPopular ? "text-black" : "text-yellow-500"
                        }
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`w-full py-3 rounded-xl font-bold flex justify-center items-center transition-colors border-2 ${plan.isPopular ? "bg-black text-white border-black hover:bg-gray-800" : "bg-transparent border-black dark:border-white hover:bg-yellow-400 hover:text-black hover:border-yellow-400"}`}
                >
                  Get Started
                </a>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section
        id="testimonials"
        className="container mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800"
      >
        <RevealOnScroll>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            What Our Clients Say
          </h2>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, index) => (
            <RevealOnScroll key={index} delay={index * 150}>
              <div className="group bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-2xl p-8 flex flex-col gap-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-[8px_8px_0px_0px_#FBBF24] hover:-translate-y-2 transition-all cursor-pointer h-full">
                <div className="flex gap-1 text-yellow-400">
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic flex-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  "{testi.text}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center font-bold text-lg text-black border-2 border-black dark:border-gray-900 group-hover:scale-110 transition-transform">
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{testi.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {testi.role}
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-10">
        <RevealOnScroll>
          <div className="bg-yellow-400 dark:bg-yellow-500 rounded-[2rem] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-full lg:w-1/2 text-black">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Get a Free SEO Audit
              </h2>
              <p className="text-lg font-medium opacity-90">
                Want to know why your website isn't ranking? Enter your details
                below and we'll send you a comprehensive, actionable report
                within 24 hours.
              </p>
            </div>
            <form
              className="w-full lg:w-1/2 flex flex-col gap-4"
              onSubmit={handleSeoSubmit}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  name="website"
                  placeholder="Website URL (e.g. codeecho.in)"
                  required
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-black bg-white text-black outline-none focus:ring-2 focus:ring-black/50"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email Address"
                  required
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-black bg-white text-black outline-none focus:ring-2 focus:ring-black/50"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-black text-white font-bold text-lg rounded-xl hover:bg-gray-800 transition-colors"
              >
                Get My Report
              </button>
            </form>
          </div>
        </RevealOnScroll>
      </section>

      <section
        id="contact"
        className="container mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800 mt-10"
      >
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">
              Let's Work Together
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Have a project in mind? Drop us a message below and we will get
              back to you within 24 hours.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl border-2 border-black dark:border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-transparent focus:border-yellow-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-transparent focus:border-yellow-500 focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-transparent focus:border-yellow-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your project requirements..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submitStatus === "sending..."}
                  className="w-full py-4 bg-yellow-400 text-black font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-500 disabled:opacity-70 transition-colors mt-2"
                >
                  {submitStatus === "sending..."
                    ? "Sending..."
                    : "Send Message"}
                  <Send size={20} />
                </button>
              </form>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <footer className="bg-gray-200 dark:bg-gray-950 pt-16 pb-8 mt-10 border-t-4 border-yellow-400 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            <div className="lg:col-span-5 flex flex-col items-start gap-4 lg:pr-10">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={scrollToTop}
              >
                <img
                  src={logo}
                  alt="Code Echo Logo"
                  className="h-12 md:h-14 w-auto"
                />
                <div className="text-2xl md:text-3xl font-bold tracking-tighter">
                  Code <span className="font-mono text-yellow-500">Echo</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-2 max-w-sm">
                Transforming Ideas into Digital Reality. We are your all-in-one
                digital partner, building solutions that accelerate your
                business growth.
              </p>
            </div>
            <div className="lg:col-span-3 lg:mx-auto">
              <h4 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
                Quick Links
              </h4>
              <ul className="flex flex-col gap-3 text-gray-600 dark:text-gray-400 font-medium">
                <li>
                  <a
                    href="#services"
                    className="hover:text-yellow-500 hover:translate-x-1 inline-block transition-transform"
                  >
                    Web Development
                  </a>
                </li>
                <li>
                  <a
                    href="#portfolio"
                    className="hover:text-yellow-500 hover:translate-x-1 inline-block transition-transform"
                  >
                    Portfolio
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-yellow-500 hover:translate-x-1 inline-block transition-transform"
                  >
                    Pricing Plans
                  </a>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-4 lg:pl-10">
              <h4 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
                Contact Us
              </h4>
              <ul className="flex flex-col gap-4 text-gray-600 dark:text-gray-400 font-medium mb-6">
                <li>
                  <a
                    href="tel:+918530455582"
                    className="flex items-center gap-3 hover:text-yellow-500 transition-colors"
                  >
                    <Phone
                      size={18}
                      className="text-yellow-500 flex-shrink-0"
                    />
                    <span>+91 8530455582</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@codeecho.in"
                    className="flex items-center gap-3 hover:text-yellow-500 transition-colors"
                  >
                    <Mail size={18} className="text-yellow-500 flex-shrink-0" />
                    <span>info@codeecho.in</span>
                  </a>
                </li>
              </ul>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.facebook.com/share/1CctreQEsF/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-yellow-400 hover:text-black transition-all"
                >
                  <FaFacebook size={18} />
                </a>
                <a
                  href="https://instagram.com/codeecho_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-yellow-400 hover:text-black transition-all"
                >
                  <FaInstagram size={18} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-800 pt-8 flex items-center justify-center text-sm">
            <p className="text-yellow-500 dark:text-yellow-400 font-medium tracking-wide">
              © 2026 Code Echo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/918530455582"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={32} />
        <span className="absolute left-16 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Chat with us
        </span>
      </a>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 bg-yellow-400 text-black border-2 border-black w-12 h-12 rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-500 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
        aria-label="Back to top"
      >
        <ArrowUp size={24} className="font-bold" />
      </button>
    </div>
  );
};

export default CodeEchoPage;
