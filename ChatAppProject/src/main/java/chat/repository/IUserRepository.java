package chat.repository;


import chat.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;


@Repository
public interface IUserRepository extends JpaRepository<User,String> {


}
