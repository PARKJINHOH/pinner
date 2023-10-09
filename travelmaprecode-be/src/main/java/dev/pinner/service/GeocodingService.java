package dev.pinner.service;

import dev.pinner.domain.dto.GeoLocationDto;
import dev.pinner.domain.dto.GeocodingApiDto;
import dev.pinner.global.GeocodingStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Arrays;
import java.util.Optional;

import static java.util.stream.Collectors.joining;

@Slf4j
@Service
public class GeocodingService {

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${google-api-key}")
    private String googleApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Reverse geocoding API 웹훅.<p>
     * {@code plus_code.compound_code}를 사용.<p><p>
     * <p>
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
     * @return human readable 주소, 결과가 없을경우 {@code null}
     */
    public GeoLocationDto.Response reverseGeocoding(double lat, double lng) throws IOException, InterruptedException {

        UriComponents googleMapUrl = UriComponentsBuilder.fromHttpUrl("https://maps.googleapis.com/maps/api/geocode/json")
                .queryParam("language", "ko")
                .queryParam("result_type", "locality")
                .queryParam("key", googleApiKey)
                .queryParam("latlng", String.format("%f,%f", lat, lng))
                .build();

        HttpRequest request = HttpRequest.newBuilder(googleMapUrl.toUri()).build();
        HttpResponse<InputStream> responseStream = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());
        GeocodingApiDto response = objectMapper.readValue(responseStream.body(), GeocodingApiDto.class);

        switch (GeocodingStatus.valueOf(response.getStatus())) {
            case OK:
                Optional<String> countryCode = getCountryCode(response);
                String readbleAddress = getReadbleAddress(response);

                return GeoLocationDto.Response.builder()
                        .name(readbleAddress)
                        .countryCd(countryCode.orElse(null))
                        .lat(lat)
                        .lng(lng)
                        .build();

            case ZERO_RESULTS:
                return null;

            default:
                log.error("역지오코딩 API를 사용 할 수 없습니다: {}, {}", response.getStatus(), response.getErrorMessage());
                throw new RuntimeException("역지오코딩 API를 사용 할 수 없습니다");
        }
    }

    private String getReadbleAddress(GeocodingApiDto response) {
        // compound code가 두 파츠 이상일 경우 해당값 사용
        if (response.getPlusCode().getCompoundCode() != null) {
            String[] compoundCodes = response.getPlusCode().getCompoundCode().split(" ");
            if (compoundCodes.length >= 2) {
                return Arrays.stream(compoundCodes).skip(1).collect(joining(" "));
            }
        }

        return response.getResults()[0].getFormattedAddress();
    }

    private Optional<String> getCountryCode(GeocodingApiDto response) {
        GeocodingApiDto.Result result = response.getResults()[0];
        GeocodingApiDto.Result.AddressComponent[] components = result.getAddressComponents();

        for (GeocodingApiDto.Result.AddressComponent component : components) {
            if (component.containCountryType()) {
                return Optional.of(component.getShortName());
            }
        }

        return Optional.empty();
    }
}
