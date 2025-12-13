
{/* Patient Selection */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Patient *
  </label>
  <select
    name="patientId"
    value={formData.patientId}
    onChange={handleChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    required
  >
    <option value="">
      {patients.length === 0 ? 'No patients available - Create a patient first' : 'Select a patient'}
    </option>
    {patients.map(patient => (
      <option key={patient.id} value={patient.id}>
        {patient.name} ({patient.email})
      </option>
    ))}
  </select>
  
  {/* Show helper text if no patients */}
  {patients.length === 0 && (
    <p className="text-sm text-red-600 mt-1">
      ⚠️ No patients found. Please create a patient account first.
    </p>
  )}
</div>