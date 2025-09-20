{/* Control bar */}
<div className="flex items-center justify-between mb-4">
  <div className="flex items-center space-x-2">
    {editMode && (
      <button
        onClick={handleAddPillar}
        className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
      >
        + Add Pillar
      </button>
    )}
    <button
      onClick={() => setEditMode(!editMode)}
      className={`px-3 py-1.5 rounded-md text-sm font-medium ${
        editMode
          ? "bg-[#b7410e] text-white hover:bg-[#93380c]"
          : "bg-[#b7410e] text-white hover:bg-[#93380c]"
      }`}
    >
      {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
    </button>
  </div>

  {/* CSV actions (only in edit mode) */}
  {editMode && (
    <div className="flex space-x-3">
      <Upload className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
      <Download className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
    </div>
  )}
</div>
