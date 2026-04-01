import CreateUserForm from "./CreateUserForm";

const HeaderUserPage = () => {
  return (
    <div className="flex justify-between">
      <div>
        <h1>Utilisateurs</h1>
        <p>Gérer les utilisateurs de la plateforme</p>
      </div>

      <CreateUserForm />
    </div>
  );
};

export default HeaderUserPage;
