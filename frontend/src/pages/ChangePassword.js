export default function Profile() {
  return (
    <>
      <div className="max-w-2xl mx-auto p-4">
        {/* Profile image section */}
        <div className="flex justify-center mb-4">
          <img
            src=""
            alt="profile image"
            className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
          />
        </div>

        {/* Buttons section */}
        <div className="flex justify-center gap-4">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Change profile picture
          </button>
          <button className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-300">
            Change password
          </button>
        </div>
      </div>
    </>
  );
}
