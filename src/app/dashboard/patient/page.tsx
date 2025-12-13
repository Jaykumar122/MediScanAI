'use client'
import React, { useState, useRef, useEffect } from 'react';
import { 
    Calendar, 
    User, 
    Activity, 
    FileText, 
    Bell, 
    Search, 
    Plus,
    Heart,
    Thermometer,
    Phone,
    ChevronDown,
    Settings,
    LogOut,
    Stethoscope,
    Pill,
    AlertCircle,
    CheckCircle,
    Download,
    MessageSquare,
    CreditCard,
    Shield,
    Camera,
    X,
    QrCode,
    Scan
} from 'lucide-react';
import { ModeToggle } from '@/components/provider/ModeToggle';
import { Moon, Sun } from 'lucide-react';


interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  refillsLeft: number;
  status: 'active' | 'completed' | 'expired';
}

interface TestResult {
  id: string;
  test: string;
  date: string;
  result: string;
  status: 'normal' | 'abnormal' | 'pending';
  doctor: string;
}

interface VitalSigns {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  lastUpdated: string;
}

const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const appointments: Appointment[] = [
    { 
      id: '1', 
      doctor: 'Dr. Sarah Wilson', 
      specialty: 'Cardiologist', 
      date: '2024-10-02', 
      time: '10:00 AM', 
      type: 'Follow-up', 
      status: 'upcoming',
      location: 'Room 205, Cardiology Wing'
    },
    { 
      id: '2', 
      doctor: 'Dr. Michael Chen', 
      specialty: 'General Practice', 
      date: '2024-10-15', 
      time: '02:30 PM', 
      type: 'Annual Check-up', 
      status: 'upcoming',
      location: 'Room 101, Main Building'
    },
    { 
      id: '3', 
      doctor: 'Dr. Emily Davis', 
      specialty: 'Dermatologist', 
      date: '2024-09-20', 
      time: '11:00 AM', 
      type: 'Consultation', 
      status: 'completed',
      location: 'Room 302, Dermatology Clinic'
    }
  ];

  const medications: Medication[] = [
    { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', refillsLeft: 2, status: 'active' },
    { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days', refillsLeft: 1, status: 'active' },
    { id: '3', name: 'Ibuprofen', dosage: '200mg', frequency: 'As needed', duration: '14 days', refillsLeft: 0, status: 'expired' },
    { id: '4', name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Once daily', duration: '60 days', refillsLeft: 3, status: 'active' }
  ];

  const testResults: TestResult[] = [
    { id: '1', test: 'Complete Blood Count', date: '2024-09-18', result: 'Normal', status: 'normal', doctor: 'Dr. Sarah Wilson' },
    { id: '2', test: 'Cholesterol Panel', date: '2024-09-18', result: 'Slightly Elevated', status: 'abnormal', doctor: 'Dr. Sarah Wilson' },
    { id: '3', test: 'Blood Glucose', date: '2024-09-15', result: 'Pending', status: 'pending', doctor: 'Dr. Michael Chen' },
    { id: '4', test: 'Thyroid Function', date: '2024-08-30', result: 'Normal', status: 'normal', doctor: 'Dr. Michael Chen' }
  ];

  const vitalSigns: VitalSigns = {
    bloodPressure: '120/80',
    heartRate: '72',
    temperature: '98.6°F',
    weight: '165 lbs',
    lastUpdated: '2024-09-25'
  };

  const patientInfo = {
    name: 'John Smith',
    age: 34,
    bloodType: 'A+',
    allergies: ['Penicillin', 'Shellfish'],
    emergencyContact: 'Jane Smith (Wife) - (555) 123-4567',
    insurance: 'Blue Cross Blue Shield'
  };

  // QR Scanner functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsScanning(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const openQRScanner = () => {
    setShowQRScanner(true);
    setScanResult(null);
    startCamera();
  };

  const closeQRScanner = () => {
    setShowQRScanner(false);
    stopCamera();
    setScanResult(null);
  };

  const simulateQRScan = () => {
    // Simulate different types of QR codes
    const qrTypes = [
      'APPOINTMENT:APT001:2024-10-05:10:00:Dr. Sarah Wilson',
      'CHECKIN:LOC001:Cardiology Wing:Room 205',
      'PRESCRIPTION:RX001:Lisinopril:10mg:Daily',
      'TEST_RESULT:TEST001:Blood Work:2024-09-28:Normal',
      'PAYMENT:BILL001:$150.00:Consultation Fee'
    ];
    const randomQR = qrTypes[Math.floor(Math.random() * qrTypes.length)];
    setScanResult(randomQR);
    stopCamera();
  };

  const processQRResult = (result: string) => {
    const [type, ...data] = result.split(':');
    
    switch (type) {
      case 'APPOINTMENT':
        return {
          title: 'Appointment Details',
          content: `ID: ${data[0]}\nDate: ${data[1]}\nTime: ${data[2]}\nDoctor: ${data[3]}`,
          action: 'View Appointment',
          color: 'blue'
        };
      case 'CHECKIN':
        return {
          title: 'Check-in Location',
          content: `Location: ${data[1]}\nRoom: ${data[2]}`,
          action: 'Check In',
          color: 'green'
        };
      case 'PRESCRIPTION':
        return {
          title: 'Prescription Info',
          content: `Medication: ${data[1]}\nDosage: ${data[2]}\nFrequency: ${data[3]}`,
          action: 'View Details',
          color: 'purple'
        };
      case 'TEST_RESULT':
        return {
          title: 'Test Result',
          content: `Test: ${data[1]}\nDate: ${data[2]}\nResult: ${data[3]}`,
          action: 'View Report',
          color: 'yellow'
        };
      case 'PAYMENT':
        return {
          title: 'Payment Information',
          content: `Amount: ${data[1]}\nDescription: ${data[2]}`,
          action: 'Pay Now',
          color: 'red'
        };
      default:
        return {
          title: 'QR Code Scanned',
          content: result,
          action: 'OK',
          color: 'gray'
        };
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup camera when component unmounts
      stopCamera();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'abnormal': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
 
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700">
      {/* Header */}
    
      <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 shadow-sm dark:shadow-gray-700">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HealthPortal</h1>
                <p className="text-sm text-gray-500">Welcome back, {patientInfo.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search health records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button 
                onClick={openQRScanner}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Scan QR Code"
              >
                <QrCode className="h-6 w-6" />
              </button>
               <ModeToggle />
              
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">JS</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <nav className="p-6 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'medications', label: 'Medications', icon: Pill },
              { id: 'test-results', label: 'Test Results', icon: FileText },
              { id: 'doctors', label: 'My Doctors', icon: Stethoscope },
              { id: 'billing', label: 'Billing', icon: CreditCard },
              { id: 'messages', label: 'Messages', icon: MessageSquare }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            
            <div className="pt-8 mt-8 border-t border-gray-200">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Health Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Next Appointment</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">Oct 2, 10:00 AM</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Dr. Sarah Wilson</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Medications</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <Pill className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">1 refill needed</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Results</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <FileText className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Blood glucose test</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Health Score</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">85</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Activity className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-green-500 mt-2">Good condition</p>
                </div>
              </div>

              {/* Patient Info & Vital Signs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Patient Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Patient Information</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{patientInfo.name}</h3>
                        <p className="text-gray-500">Age: {patientInfo.age} • Blood Type: {patientInfo.bloodType}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Insurance: {patientInfo.insurance}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-gray-600">Allergies: {patientInfo.allergies.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Emergency: {patientInfo.emergencyContact}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Latest Vital Signs</h2>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        View History
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Blood Pressure</p>
                        <p className="text-xl font-bold text-gray-900">{vitalSigns.bloodPressure}</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Heart Rate</p>
                        <p className="text-xl font-bold text-gray-900">{vitalSigns.heartRate} bpm</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <Thermometer className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="text-xl font-bold text-gray-900">{vitalSigns.temperature}</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <User className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="text-xl font-bold text-gray-900">{vitalSigns.weight}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 text-center">
                      Last updated: {vitalSigns.lastUpdated}
                    </p>
                  </div>
                </div>
              </div>

              {/* Upcoming Appointments & Recent Results */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Book</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {appointments.filter(apt => apt.status === 'upcoming').map((appointment) => (
                      <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{appointment.doctor}</p>
                            <p className="text-sm text-gray-500">{appointment.specialty}</p>
                            <p className="text-sm text-gray-400">{appointment.date} at {appointment.time}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Test Results */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Recent Test Results</h2>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {testResults.slice(0, 3).map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{result.test}</p>
                          <p className="text-sm text-gray-500">Dr. {result.doctor}</p>
                          <p className="text-sm text-gray-400">{result.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                            {result.result}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Book Appointment</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="p-6 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Stethoscope className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                              <p className="text-gray-500">{appointment.specialty}</p>
                              <p className="text-sm text-gray-400">{appointment.date} at {appointment.time}</p>
                              <p className="text-sm text-gray-400">{appointment.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                            {appointment.status === 'upcoming' && (
                              <button className="text-blue-600 hover:text-blue-700 font-medium">
                                Reschedule
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Medications</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add Medication</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="space-y-4">
                    {medications.map((medication) => (
                      <div key={medication.id} className="p-6 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <Pill className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{medication.name}</h3>
                              <p className="text-gray-500">{medication.dosage} • {medication.frequency}</p>
                              <p className="text-sm text-gray-400">Duration: {medication.duration} • Refills: {medication.refillsLeft}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(medication.status)}`}>
                              {medication.status}
                            </span>
                            {medication.status === 'active' && medication.refillsLeft > 0 && (
                              <button className="text-blue-600 hover:text-blue-700 font-medium">
                                Request Refill
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'test-results' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Download All</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="space-y-4">
                    {testResults.map((result) => (
                      <div key={result.id} className="p-6 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                              <FileText className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{result.test}</h3>
                              <p className="text-gray-500">Ordered by {result.doctor}</p>
                              <p className="text-sm text-gray-400">{result.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                              {result.result}
                            </span>
                            {result.status !== 'pending' && (
                              <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {['doctors', 'billing', 'messages'].includes(activeTab) && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'doctors' ? <Stethoscope className="h-8 w-8 text-gray-400" /> : 
                 activeTab === 'billing' ? <CreditCard className="h-8 w-8 text-gray-400" /> :
                 <MessageSquare className="h-8 w-8 text-gray-400" />}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab === 'doctors' ? 'My Doctors' : 
                 activeTab === 'billing' ? 'Billing & Insurance' : 'Messages'}
              </h2>
              <p className="text-gray-500">
                {activeTab === 'doctors' ? 'Your healthcare providers and their contact information will be displayed here.' :
                 activeTab === 'billing' ? 'Your bills, payments, and insurance information will be shown here.' :
                 'Your messages with healthcare providers will appear here.'}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">QR Code Scanner</h2>
              <button 
                onClick={closeQRScanner}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {scanResult ? (
              // Show scan result
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`w-16 h-16 bg-${processQRResult(scanResult).color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <CheckCircle className={`h-8 w-8 text-${processQRResult(scanResult).color}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {processQRResult(scanResult).title}
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {processQRResult(scanResult).content}
                    </pre>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={closeQRScanner}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button 
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => {
                      // Handle specific actions based on QR type
                      alert(`${processQRResult(scanResult).action} clicked!`);
                      closeQRScanner();
                    }}
                  >
                    {processQRResult(scanResult).action}
                  </button>
                </div>
              </div>
            ) : (
              // Show camera view
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  
                  {/* Scanner overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 border-2 border-white opacity-50"></div>
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500"></div>
                    </div>
                  </div>
                  
                  {!isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                      <div className="text-center text-white">
                        <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-75">Camera loading...</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Point your camera at a QR code to scan
                  </p>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={closeQRScanner}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={simulateQRScan}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                    >
                      <Scan className="h-4 w-4" />
                      <span>Demo Scan</span>
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      <p className="font-medium mb-1">QR codes can be used for:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-600">
                        <li>Quick check-in at appointments</li>
                        <li>Accessing prescription details</li>
                        <li>Viewing test results</li>
                        <li>Making payments</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};



export default PatientDashboard;