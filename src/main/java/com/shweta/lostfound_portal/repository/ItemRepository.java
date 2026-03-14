package com.shweta.lostfound_portal.repository;

import com.shweta.lostfound_portal.enums.ItemStatus;
import com.shweta.lostfound_portal.enums.ItemType;
import com.shweta.lostfound_portal.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    
    @Query("SELECT i FROM Item i WHERE i.type = :type")
    List<Item> findByType(@Param("type") ItemType type);
    
    @Query("SELECT i FROM Item i WHERE i.type = :type AND i.status = :status")
    List<Item> findByTypeAndStatus(@Param("type") ItemType type, @Param("status") ItemStatus status);
    
    @Query("SELECT i FROM Item i WHERE i.type = :type AND " +
           "(LOWER(i.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.location) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.studentName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.studentNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.foundBy) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Item> searchItems(@Param("type") ItemType type, @Param("keyword") String keyword);
    
    @Query("SELECT i FROM Item i WHERE " +
           "(LOWER(i.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.location) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.studentName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.studentNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.foundBy) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Item> searchAllItems(@Param("keyword") String keyword);
}

