package com.pinner.global.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class LocalStorageService implements StorageService {

    @Value("${storage.path}")
    private String storagePath;

    @Override
    public String upload(MultipartFile file, String relativePath) {
        try {
            Path fullPath = Paths.get(storagePath, relativePath);
            Files.createDirectories(fullPath.getParent());
            file.transferTo(fullPath);
            return relativePath;
        } catch (IOException e) {
            throw new RuntimeException("파일 저장에 실패했습니다: " + relativePath, e);
        }
    }

    @Override
    public void delete(String relativePath) {
        try {
            Path fullPath = Paths.get(storagePath, relativePath);
            Files.deleteIfExists(fullPath);
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제에 실패했습니다: " + relativePath, e);
        }
    }

    @Override
    public String getFullPath(String relativePath) {
        return Paths.get(storagePath, relativePath).toAbsolutePath().toString();
    }
}
