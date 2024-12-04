export default function ChangeProfilePicture(){

  return (
    <>
      <div>
        <h2>Change Profile Picture</h2>

       

        {/* File Input */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange=""
          />
        </div>

        {/* Submit Button */}
        <div>
          <button onClick="">Upload New Profile Picture</button>
        </div>
      </div>
    </>
  
  )
}