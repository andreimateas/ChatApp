package chat.domain;

public class User{

    ///id
    private String username;

    private String password;

    private String email;
    private String name;
    private String profilePicture;

    private String location;

    public User(String username, String password, String email, String name, String profilePicture, String location) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = name;
        this.profilePicture = profilePicture;
        this.location = location;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
