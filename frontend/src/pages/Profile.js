import { useNavigate } from "react-router-dom";

export default function Profile() {

  const navigate = useNavigate();

  const goChangepassword = () => {


     navigate('/changepassword');

  }

  const gochangeprofilepic = () => {


    navigate('/changeprofilepic');

 }
  return (
    <>
      <div >
        {/* Profile image section */}
        <div >
          <img
            src=""
            alt="profile image"
          />
        </div>

        {/* Buttons section */}
        <div >
          <button onClick={gochangeprofilepic}>
            Change profile picture
          </button>
          <button  onClick={goChangepassword}>
            Change password
          </button>
        </div>
      </div>
    </>
  );
}
