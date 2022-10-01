package com.example.travelmaprecodebe.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/geocoding")
public class Geocoding {
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final String googleApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Geocoding(@Value("${google-api-key}") String googleApiKey) throws MalformedURLException {
        this.googleApiKey = googleApiKey;
    }

    /**
     * 주어진 위도와 경도를 기반으로 국가와 시로 구성된 문자열 반환
     *
     * @param lat     latitude
     * @param lng     longitude
     * @param reverse must be {@code true}
     * @return formatted string in Korean. for example, {@code 포르투갈 포르토}
     */
    @GetMapping
    public ResponseEntity<?> geocoding(
            @RequestParam("lat") @NotNull double lat,
            @RequestParam("lng") @NotNull double lng,
            @RequestParam("reverse") boolean reverse
    ) {
        try {
            if (!reverse) {
                return ResponseEntity.badRequest().body("this api only accept reverse geocoding");
            }

            return ResponseEntity.ok(Map.of("name", reverseGeocoding(lat, lng)));
        } catch (Exception e) {
            log.error("something wrong: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    /**
     * Reverse geocoding API 웹훅.<p>
     * {@code plus_code.compound_code}를 사용.<p>
     *
     * e.g)
     * <table>
     *     <thead>
     *         <tr>
     *             <th>intput</th>
     *             <th>output</th>
     *         </tr>
     *     </thead>
     *     <tbody>
     *         <tr>
     *             <td>R8RJ+9JM 프랑스 파리</td>
     *             <td>프랑스 파리</td>
     *         </tr>
     *         <tr>
     *             <td>PVJ5+FRH 대한민국 강원도 강릉시</td>
     *             <td>대한민국 강원도 강릉시</td>
     *         </tr>
     *         <tr>
     *             <td>GXQH+FHQ 대한민국 서울특별시</td>
     *             <td>대한민국 서울특별시</td>
     *         </tr>
     *         <tr>
     *             <td>P27Q+MCM 미국 뉴욕</td>
     *             <td>미국 뉴욕</td>
     *         </tr>
     *         <tr>
     *             <td>WQXW+4WF 영국 에든버러</td>
     *             <td>영국 에든버러</td>
     *         </tr>
     *         <tr>
     *             <td>VQPX+FR3 일본 교토부 우지시</td>
     *             <td>일본 교토부 우지시</td>
     *         </tr>
     *         <tr>
     *             <td>MFXV+CMX 일본 오사카부 오사카시</td>
     *             <td>일본 오사카부 오사카시</td>
     *         </tr>
     *         <tr>
     *             <td>5926+5XW 포르투갈 포르토</td>
     *             <td>포르투갈 포르토</td>
     *         </tr>
     *         <tr>
     *             <td>HPCR+745 프랑스 스트라스부르</td>
     *             <td>프랑스 스트라스부르</td>
     *         </tr>
     *     </tbody>
     * </table>
     *
     * <p><p>
     * <h2>원본 응답<h2>
     * <pre>
     * {
     *     "plus_code": {
     *         "compound_code": "5926+5XW 포르투갈 포르토",
     *         "global_code": "8CHH5926+5XW"
     *     },
     *     "results": [
     *         {
     *             "address_components": [
     *                 {
     *                     "long_name": "포르토",
     *                     "short_name": "포르토",
     *                     "types": [
     *                         "locality",
     *                         "political"
     *                     ]
     *                 },
     *                 {
     *                     "long_name": "포르토",
     *                     "short_name": "포르토",
     *                     "types": [
     *                         "administrative_area_level_1",
     *                         "political"
     *                     ]
     *                 },
     *                 {
     *                     "long_name": "포르투갈",
     *                     "short_name": "PT",
     *                     "types": [
     *                         "country",
     *                         "political"
     *                     ]
     *                 }
     *             ],
     *             "formatted_address": "포르투갈 포르토",
     *             "geometry": {
     *                 "bounds": {
     *                     "northeast": {
     *                         "lat": 41.1859353,
     *                         "lng": -8.5526134
     *                     },
     *                     "southwest": {
     *                         "lat": 41.1383506,
     *                         "lng": -8.6912939
     *                     }
     *                 },
     *                 "location": {
     *                     "lat": 41.1579438,
     *                     "lng": -8.629105299999999
     *                 },
     *                 "location_type": "APPROXIMATE",
     *                 "viewport": {
     *                     "northeast": {
     *                         "lat": 41.1859353,
     *                         "lng": -8.5526134
     *                     },
     *                     "southwest": {
     *                         "lat": 41.1383506,
     *                         "lng": -8.6912939
     *                     }
     *                 }
     *             },
     *             "place_id": "ChIJwVPhxKtlJA0RvBSxQFbZSKY",
     *             "types": [
     *                 "locality",
     *                 "political"
     *             ]
     *         }
     *     ],
     *     "status": "OK"
     * }
     * </pre>
     *
     * @param lat
     * @param lng
     * @return
     */
    private String reverseGeocoding(double lat, double lng) throws IOException, InterruptedException {

        URI uri = URI.create(String.format("https://maps.googleapis.com/maps/api/geocode/json?language=ko&result_type=locality&key=%s&latlng=%f,%f", googleApiKey, lat, lng));

        HttpRequest request = HttpRequest.newBuilder(uri).build();
        HttpResponse<InputStream> response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());
        GeocodingResponse value = objectMapper.readValue(response.body(), GeocodingResponse.class);

        log.debug("리버스 지오코딩 응답: {}", value);

        return Arrays.stream(value.plusCode.compoundCode.split(" ")).skip(1).collect(Collectors.joining(" "));
    }

    /**
     * Response DTO of google reverse geocoding.
     */
    @Data
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    private static class GeocodingResponse {

        private PlusCode plusCode;
        private Result[] results;
        private String status;

        @Data
        @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
        public static class PlusCode {
            private String compoundCode;
            private String globalCode;
        }

        @Data
        @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
        public static class Result {
            private AddressComponent[] addressComponents;
            private String formattedAddress;
            private Geometry geometry;
            private String placeID;
            private String[] types;

            @Data
            @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
            public static class AddressComponent {
                private String longName;
                private String shortName;
                private String[] types;
            }

            @Data
            @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
            public static class Geometry {
                private Bounds bounds;
                private Location location;
                private String locationType;
                private Bounds viewport;

                @Data
                @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
                public static class Bounds {
                    private Location northeast;
                    private Location southwest;
                }

                @Data
                @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
                public static class Location {
                    private double lat;
                    private double lng;
                }
            }
        }
    }
}
