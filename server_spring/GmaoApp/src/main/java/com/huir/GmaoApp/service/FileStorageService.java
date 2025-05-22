package com.huir.GmaoApp.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;



@Service
public class FileStorageService {
	
	
	 private final Path uploadDir = Paths.get("uploads");

	    public FileStorageService() throws IOException {
	        if (!Files.exists(uploadDir)) {
	            Files.createDirectories(uploadDir);
	        }
	    }
	    public String storeFile(MultipartFile file) throws IOException {
	        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
	        Path filePath = uploadDir.resolve(fileName);
	        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
	        // Return the U  URRL or path you want à exposer (à adapter selon frontend/backend)
	        return "/uploads/" + fileName;
	    }

}
 