export default function ChangePassword() {
  return (
    <>
      <div >
        <h2 >Change Password</h2>
        
        <form action="#" method="POST">
          {/* Current Password */}
          <div >
            <label htmlFor="currentPassword" >Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              required
              
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label htmlFor="newPassword" >New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              required
              
            />
          </div>

          {/* Confirm New Password */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" >Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
