package com.shweta.lostfound_portal.config;

import com.shweta.lostfound_portal.enums.ItemStatus;
import com.shweta.lostfound_portal.enums.ItemType;
import com.shweta.lostfound_portal.model.Item;
import com.shweta.lostfound_portal.repository.ItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {
    
    @Bean
    public CommandLineRunner initializeData(ItemRepository itemRepository) {
        return args -> {
            // Check if data already exists
            if (itemRepository.count() > 0) {
                return;
            }
            
            // Create sample lost items
            Item lostItem1 = new Item();
            lostItem1.setType(ItemType.LOST);
            lostItem1.setItemName("Car Keys");
            lostItem1.setDescription("Silver car keys with blue keychain");
            lostItem1.setLocation("Library Building");
            lostItem1.setStudentName("Alice Johnson");
            lostItem1.setStudentNumber("STU001");
            lostItem1.setStatus(ItemStatus.LOST);
            lostItem1.setDateReported(LocalDateTime.now().minusDays(2));
            itemRepository.save(lostItem1);
            
            Item lostItem2 = new Item();
            lostItem2.setType(ItemType.LOST);
            lostItem2.setItemName("iPhone 13");
            lostItem2.setDescription("Black iPhone 13 with cracked screen protector");
            lostItem2.setLocation("Cafeteria");
            lostItem2.setStudentName("Bob Smith");
            lostItem2.setStudentNumber("STU002");
            lostItem2.setStatus(ItemStatus.LOST);
            lostItem2.setDateReported(LocalDateTime.now().minusDays(1));
            itemRepository.save(lostItem2);
            
            Item lostItem3 = new Item();
            lostItem3.setType(ItemType.LOST);
            lostItem3.setItemName("Student ID Card");
            lostItem3.setDescription("Red student ID with photo");
            lostItem3.setLocation("Gym");
            lostItem3.setStudentName("Charlie Davis");
            lostItem3.setStudentNumber("STU003");
            lostItem3.setStatus(ItemStatus.LOST);
            lostItem3.setDateReported(LocalDateTime.now());
            itemRepository.save(lostItem3);
            
            // Create sample found items
            Item foundItem1 = new Item();
            foundItem1.setType(ItemType.FOUND);
            foundItem1.setItemName("Wallet");
            foundItem1.setDescription("Brown leather wallet with multiple cards");
            foundItem1.setLocation("Lost and Found Desk");
            foundItem1.setFoundBy("Security");
            foundItem1.setStatus(ItemStatus.NOT_CLAIMED);
            foundItem1.setDateFound(LocalDateTime.now().minusDays(3));
            itemRepository.save(foundItem1);
            
            Item foundItem2 = new Item();
            foundItem2.setType(ItemType.FOUND);
            foundItem2.setItemName("Laptop");
            foundItem2.setDescription("Dell Inspiron 15 laptop, serial no. 123456");
            foundItem2.setLocation("Classroom 201");
            foundItem2.setFoundBy("Maintenance Staff");
            foundItem2.setStatus(ItemStatus.NOT_CLAIMED);
            foundItem2.setDateFound(LocalDateTime.now().minusDays(2));
            itemRepository.save(foundItem2);
            
            Item foundItem3 = new Item();
            foundItem3.setType(ItemType.FOUND);
            foundItem3.setItemName("Water Bottle");
            foundItem3.setDescription("Blue metal water bottle with stickers");
            foundItem3.setLocation("Sports Complex");
            foundItem3.setFoundBy("Cleaning Staff");
            foundItem3.setStatus(ItemStatus.CLAIMED);
            foundItem3.setDateFound(LocalDateTime.now().minusDays(1));
            itemRepository.save(foundItem3);
            
            System.out.println("Sample data initialized successfully!");
        };
    }
}

