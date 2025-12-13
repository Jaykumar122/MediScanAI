"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from "framer-motion";
import WorldMap from "@/components/ui/world-map";
import { WavyBackground } from "@/components/ui/wavy-background";

import { 
  Brain, Shield, Zap, Users, Award, ArrowRight, Menu, X,
  Stethoscope, Activity, Heart, Globe, Play, Star,
  Camera, QrCode, FileImage, MessageSquare, BarChart3, UserCircle
} from 'lucide-react';

const MediScanHomepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const heroSectionRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const digitalFeatures = useMemo(() => [
    {
      icon: <QrCode className="w-12 h-12 text-blue-500" />,
      title: "Unique QR Code Generation",
      description: "Instantly generate secure, unique QR codes for every prescription, limiting scan counts to prevent misuse."
    },
    {
      icon: <FileImage className="w-12 h-12 text-blue-500" />,
      title: "PDF & Image Analysis",
      description: "Leverage AI to analyze medical documents and images, assisting doctors in making faster, more accurate diagnoses."
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-blue-500" />,
      title: "AI-Powered Conversation",
      description: "Engage with a context-aware AI assistant across all dashboards for intelligent support and information retrieval."
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-500" />,
      title: "Secure & Role-Based Access",
      description: "Dedicated dashboards for Doctors, Patients, and Admins with secure JWT authentication."
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-blue-500" />,
      title: "Status & Medication Tracking",
      description: "Monitor prescription validity and track medication history with ease for better patient management."
    },
    {
      icon: <UserCircle className="w-12 h-12 text-blue-500" />,
      title: "Dedicated User Dashboards",
      description: "Separate, intuitive dashboards for patients, medical shops, and general users for a tailored experience."
    }
  ], []);

  const features = useMemo(() => [
    {
      icon: <Brain className="w-12 h-12 text-blue-500" />,
      title: "AI-Powered Analysis",
      description: "Advanced deep learning algorithms analyze medical scans with 99.5% accuracy, providing instant diagnostic insights for healthcare professionals."
    },
    {
      icon: <Shield className="w-12 h-12 text-green-500" />,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security ensures patient data remains protected with end-to-end encryption, audit trails, and full compliance certifications."
    },
    {
      icon: <Zap className="w-12 h-12 text-yellow-500" />,
      title: "Instant Results",
      description: "Get comprehensive diagnostic results in under 30 seconds. Streamline your workflow and dramatically improve patient care efficiency."
    },
    {
      icon: <Users className="w-12 h-12 text-purple-500" />,
      title: "Global Collaboration",
      description: "Connect with specialists worldwide, share findings instantly, and get second opinions from leading medical experts in real-time."
    }
  ], []);

  const stats = useMemo(() => [
    { number: "500K+", label: "Scans Analyzed", color: "from-blue-400 to-blue-600" },
    { number: "99.5%", label: "Accuracy Rate", color: "from-green-400 to-green-600" },
    { number: "2,500+", label: "Hospitals", color: "from-purple-400 to-purple-600" },
    { number: "24/7", label: "AI Support", color: "from-orange-400 to-orange-600" }
  ], []);

  const testimonials = useMemo(() => [
    {
      name: "Dr. Sarah Mitchell",
      role: "Chief Radiologist, Metro General Hospital",
      content: "MediScan AI has revolutionized our diagnostic workflow. The accuracy and speed are unprecedented.",
      avatar: "SM"
    },
    {
      name: "Dr. James Chen",
      role: "Emergency Medicine Director",
      content: "In critical situations, every second counts. MediScan AI helps us make faster, more accurate decisions.",
      avatar: "JC"
    },
    {
      name: "Dr. Maria Rodriguez",
      role: "Diagnostic Imaging Specialist",
      content: "The global collaboration features have connected us with experts worldwide. Truly game-changing.",
      avatar: "MR"
    }
  ], []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50 
            ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                  MediScan AI
                </span>
                <div className="text-xs text-gray-500 -mt-1">Medical Intelligence</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105">
                Features
              </a>
              <a href="#global" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105">
                Global Network
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105">
                Research
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105">
                Contact
              </a>
              <button 
              onClick={() => window.location.href = '/login'}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                Get Started
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t border-gray-100 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-xl"
            >
              <div className="flex flex-col space-y-4 px-4">
                <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2">
                  Features
                </a>
                <a href="#global" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2">
                  Global Network
                </a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2">
                  Research
                </a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2">
                  Contact
                </a>
                <button 
              onClick={() => window.location.href = '/login'}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section with WavyBackground */}
      <section ref={heroSectionRef} className="relative min-h-screen flex items-center overflow-hidden">
        <WavyBackground 
          className="absolute inset-0"
          backgroundFill="linear-gradient(135deg, #1e40af 0%, #7c3aed 70%, #1e1b4b 100%)"
          colors={["#3b82f6", "#8b5cf6", "#06b6d4"]}
          waveWidth={60}
          blur={10}
          speed="slow"
          waveOpacity={0.7}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm mb-8"
              >
                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium">Trusted by 2,500+ Healthcare Providers</span>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                The Future of
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mt-2">
                  Medical Imaging
                </span>
              </h1>
              <p className="text-xl lg:text-2xl mb-10 text-blue-100 leading-relaxed max-w-2xl">
                Harness the power of artificial intelligence to revolutionize medical diagnostics. 
                Faster analysis, higher accuracy, better patient outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <button className="group bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button className="group border-2 border-white/30 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all duration-500 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-3xl p-8 border border-cyan-300/30 backdrop-blur-sm"
                  >
                    <Camera className="w-10 h-10 text-cyan-300 mb-6" />
                    <h3 className="text-white font-bold text-lg mb-3">Scan Analysis</h3>
                    <div className="w-full bg-cyan-300/20 rounded-full h-3">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="bg-gradient-to-r from-cyan-300 to-blue-400 h-3 rounded-full"
                      ></motion.div>
                    </div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05, rotateY: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-3xl p-8 border border-purple-300/30 backdrop-blur-sm"
                  >
                    <Heart className="w-10 h-10 text-purple-300 mb-6 animate-pulse" />
                    <h3 className="text-white font-bold text-lg mb-3">Vital Signs</h3>
                    <div className="flex items-center">
                      <Activity className="w-6 h-6 text-purple-300 mr-3" />
                      <span className="text-white font-mono text-xl">78 BPM</span>
                    </div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="col-span-2 bg-gradient-to-r from-green-400/20 to-emerald-600/20 rounded-3xl p-8 border border-green-300/30 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-bold text-xl mb-2">AI Confidence</h3>
                        <motion.p 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 1 }}
                          className="text-green-300 text-4xl font-bold"
                        >
                          99.5%
                        </motion.p>
                      </div>
                      <Award className="w-16 h-16 text-green-300" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Digital Healthcare Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
              A New Era of Digital Healthcare
            </h2>
            <p className="text-xl text-gray-500 max-w-4xl mx-auto leading-relaxed">
              MediScanAI integrates cutting-edge technology to streamline workflows and improve patient care.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {digitalFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 cursor-pointer group transition-all duration-500"
              >
                <div className="mb-6 group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-base group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-gray-900">
              Revolutionary Features for
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent mt-2">
                Modern Healthcare
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our AI-powered platform combines cutting-edge machine learning with intuitive design 
              to deliver unprecedented diagnostic capabilities for healthcare professionals worldwide.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-gray-100 cursor-pointer group transition-all duration-500"
              >
                <div className="mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Network Section */}
      <section id="global" className="py-40 dark:bg-black bg-white w-full">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="font-bold text-5xl md:text-6xl text-gray-900 dark:text-white mb-6">
            Global{" "}
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent mt-2">
              Healthcare Network
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Connect with medical professionals across continents. Our AI-powered platform enables 
            seamless collaboration, breaking down barriers in healthcare delivery and bringing expert 
            knowledge to every corner of the world.
          </p>
        </div>
        <WorldMap
          dots={[
            {
              start: {
                lat: 64.2008,
                lng: -149.4937,
              }, // Alaska (Fairbanks)
              end: {
                lat: 34.0522,
                lng: -118.2437,
              }, // Los Angeles
            },
            {
              start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
              end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
            },
            {
              start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
              end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
            },
            {
              start: { lat: 51.5074, lng: -0.1278 }, // London
              end: { lat: 28.6139, lng: 77.209 }, // New Delhi
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
            },
          ]}
        />
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-gray-900">
              Trusted by
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                Healthcare Leaders
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what medical professionals are saying about MediScan AI
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-300"
              >
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-6xl font-bold text-white mb-8"
          >
            Ready to Transform Healthcare?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Join thousands of healthcare professionals using MediScan AI to deliver 
            faster, more accurate diagnoses and improve patient outcomes worldwide.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <button className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              Schedule Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-10">
            <div className="md:col-span-2 group">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    MediScan AI
                  </span>
                  <div className="text-xs text-gray-400 -mt-1">Medical Intelligence</div>
                </div>
              </div>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Revolutionizing medical imaging with AI-powered diagnostic solutions. 
                Empowering healthcare professionals with cutting-edge technology for better patient outcomes.
              </p>
              <div className="flex space-x-4">
                {['LinkedIn', 'Twitter', 'Research'].map((social) => (
                  <a key={social} href="#" className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 shadow-lg">
                    <Globe className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-blue-400 text-lg">Product</h4>
              <div className="space-y-4 text-gray-400">
                <a href="#" className="block hover:text-white hover:translate-x-2 transition-all duration-200 text-base">Radiology</a>
                <a href="#" className="block hover:text-white hover:translate-x-2 transition-all duration-200 text-base">Pathology</a>
                <a href="#" className="block hover:text-white hover:translate-x-2 transition-all duration-200 text-base">Emergency Care</a>
                <a href="#" className="block hover:text-white hover:translate-x-2 transition-all duration-200 text-base">Telemedicine</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-green-400 text-lg">Support</h4>
              <div className="space-y-4 text-gray-400">
                <a href="#" className="block hover:text-white hover:translate-x-2 transition-all duration-200 text-base">Documentation</a>
                <a href="#" className="block hover:text-white hover:translate-x-2 transition-all duration-200 text-base">Training</a>
                <a href="#" className="block hover:text-white hover:translate-x-2 transition-all duration-200 text-base">24/7 Support</a>
                <a href="#" className="block hover:text-white hover:translate-x-2 transition-all duration-200 text-base">API Reference</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-16 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
                <p>&copy; 2025 MediScan AI. All rights reserved.</p>
                <p className="text-sm mt-1">Advancing healthcare through artificial intelligence.</p>
              </div>
              <div className="flex space-x-6 text-gray-400 text-sm">
                <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors duration-200">HIPAA Compliance</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MediScanHomepage;