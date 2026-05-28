package com.pinner.global.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String upload(MultipartFile file, String relativePath);

    void delete(String relativePath);

    String getFullPath(String relativePath);
}
