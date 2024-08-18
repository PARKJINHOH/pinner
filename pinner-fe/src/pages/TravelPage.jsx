import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

// api
import { HTTPStatus, useAPIv1 } from 'apis/traveler/apiv1';

// component
import { boundsHasInfo, is_journey_has_location } from 'utils';
import { googleMapState } from 'states/map';
import { NewJourneyStep, newJourneyStepState, newLocationState } from 'states/modal';
import { selectedTravelBoundsState, selectedTravelState } from 'states/travel';

// etc
import "@yaireo/tagify/dist/tagify.css";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// google map
import { GoogleMap, InfoWindow, LoadScript, Marker, Polyline, StandaloneSearchBox } from '@react-google-maps/api';



export default function TravelPage() {
    const containerStyle = {
        width: '100%',
        height: '100vh',
    };

    const [map, setMap] = useState(/** @type {google.maps.Map|null} */(null));

    const [gMap, setGMap] = useRecoilState(googleMapState);
    const [libraries] = useState(['places']);

    const apiv1 = useAPIv1();

    const [newJourneyStep, setNewJourneyStep] = useRecoilState(newJourneyStepState);
    const setNewLocationState = useSetRecoilState(newLocationState);

    /**
     * NOTE: 위치 선택시 커서 모양 변경의 구현에 관하여
     *
     * - Google map은 특정 상황일 때 커서 모양을 변경하는 기능을 제공하지 않음
     * - 하지만 draggableCursor 옵션을 제공
     * - draggableCursor 옵션을 newJourneyStep 상태에 따라 default와 crosshair로 전환하는것을 통해 우회하여 구현
     */
    const mapOptions = {
        fullscreenControl: false,
        draggableCursor: newJourneyStep === NewJourneyStep.LOCATING ? 'crosshair' : 'default',
        styles: mapTypeStyleFactory(),
    };

    /** @type {Travel} */
    const selectedTravel = useRecoilValue(selectedTravelState);


    const bounds = useRecoilValue(selectedTravelBoundsState);


    useEffect(() => {
        if (boundsHasInfo(bounds)) {
            map.fitBounds(bounds, 300);
        }
    }, [bounds]);



    // 검색창
    const placeRef = useRef(null);


    /**
     * 주어진 Viewport의 중간 좌표를 구한다.
     * @param {Viewport} viewport
     */
    function middleOfViewport(viewport) {
        return {
            "ua": (viewport.Wh.lo + viewport.Wh.hi) / 2,
            "ga": (viewport.Gh.lo + viewport.Gh.hi) / 2,
        };
    }

    /**
     * 사용자가 검색을 시도하면 호출되는 함수
     */
    function onPlacesChanged() {
        /**
         * @type {Place[]}
         */
        const places = placeRef.current.getPlaces();
        if (places === undefined || places.length === 0) return;
        const place = places[0];

        const ua_ia = middleOfViewport(place.geometry.viewport);
        setGMap({ ...gMap, center: { lat: ua_ia.ua, lng: ua_ia.ga }, zoom: 13})
    }

    return (
        <div>
            <ToastContainer
                autoClose={3000}
                pauseOnFocusLoss={false}
            />
            {/*{*/}
            {/*    // selectedTravel가 undefinded인 상태가 있을 수 있음.*/}
            {/*    // 이는 TravelePill에서 setSelected를 사용해 초기화 됨.*/}
            {/*    newJourneyStep === NewJourneyStep.EDITTING && <NewJourneyModal travelId={selectedTravel.id} />*/}
            {/*}*/}

            <LoadScript
                libraries={libraries}
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                region={'KR'}
            >
                {/* https://react-google-maps-api-docs.netlify.app/ */}
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    options={mapOptions}
                    zoom={gMap.zoom}
                    center={gMap.center}
                    clickableIcons={false}

                    onLoad={setMap}

                    // 맵 클릭시 위치 정보 획득
                    onClick={async (e) => {
                        const loc = {
                            lat: e.latLng.lat(),
                            lng: e.latLng.lng(),
                            countryCd: "",
                            name: "",
                        };

                        // Locating 모드일 때만 역 지오코딩 API 요청
                        if (newJourneyStep === NewJourneyStep.LOCATING) {
                            await apiv1.get(
                                '/geocoding',
                                {params: {lat: loc.lat, lng: loc.lng, reverse: true}}
                            ).then(response => {
                                loc.name = response.data.name;
                                loc.countryCd = response.data.countryCd;
                                setNewLocationState(loc);
                                setNewJourneyStep(NewJourneyStep.EDITTING);
                            }).catch(error => {
                                toast.error("지정한 장소의 이름을 가져 올 수 없어요. 직접 입력해 주세요.")
                                setNewJourneyStep(NewJourneyStep.EDITTING);
                            });
                        }
                    }}
                >
                    <SearchBar
                        onLoadPlaces={(place) => placeRef.current = place}
                        onPlacesChanged={onPlacesChanged}
                    ></SearchBar>

                    {selectedTravel && <DrawSelectedTravel selectedTravel={selectedTravel} />}
                </GoogleMap>

            </LoadScript>
        </div>
    );
}

function SearchBar(params) {
    return <StandaloneSearchBox
        onLoad={params.onLoadPlaces}
        onPlacesChanged={params.onPlacesChanged}
    >
        <input
            type="text"
            placeholder="Customized your placeholder"
            style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: "absolute",
                left: "50%",
                marginLeft: "-120px"
            }}
        />
    </StandaloneSearchBox>
}

function mapTypeStyleFactory() {
    const offTypes = [
        "poi.government",
        "poi.medical",
        "poi.school",
        "poi.sports_complex",
    ];

    const onTypes = [
        "administrative",
        "landscape",
        "poi.attraction",
        "poi.business",
        "poi.park",
        "poi.place_of_worship",
        "transit",
    ];

    return [
        ...offTypes.map(t => { return { featureType: t, stylers: [{ visibility: "off" }] } }),
        ...onTypes.map(t => { return { featureType: t, stylers: [{ visibility: "on" }] } }),
    ];
}

/**
 *
 * @param {{selectedTravel: Travel}} props
 */
function DrawSelectedTravel({ selectedTravel }) {

    /**
     * Draws markers on map
     *
     * @param {Travel} selectedTravel
     * @returns {CustomMarker[]}
     */
    function drawMarkers(selectedTravel) {
        return selectedTravel.journeys.filter(is_journey_has_location).map((journey) =>
            <PhotoMarker key={journey.id} journey={journey} />
        );
    }

    /**
     * Groups journeys by date
     *
     * @param {Journey[]} journeys
     * @returns { Object.< string, Journey[] >}
     */
    function gruopByDate(journeys) {
        const dates = enumerateDate(journeys);

        let groups = {};

        for (const date of dates) {
            groups[date] = journeys.filter(journey => journey.date === date);
        }

        return groups;
    }

    /**
     * Enumerates unique dates in an array of journeys
     *
     * @param {Journey[]} journeys
     * @returns {Set<string>}
     */
    function enumerateDate(journeys) {
        return new Set(journeys.map(journey => journey.date));
    }

    /**
     * Draws a line using Polyline component for each group of journeys by date
     *
     * @param {Travel} selectedTravel
     * @param {Journey[]} selectedTravel.journeys
     * @returns {Polyline[]}
     */
    function drawLine(selectedTravel) {
        const groups = gruopByDate(selectedTravel.journeys.filter(is_journey_has_location));

        // Note
        //
        // Only 5 colors are hard-coded.
        // Need to find way to generate color or
        // add enough number of colors.
        const colorPallet = [
            "#8CB369",
            "#F4E285",
            "#F4A259",
            "#5B8E7D",
            "#BC4B51",
        ];

        let lines = [];

        for (const key in groups) {
            if (Object.hasOwnProperty.call(groups, key)) {
                const jouneyGroup = groups[key];
                const color = colorPallet.pop();

                lines.push(
                    <Polyline
                        key={key}
                        path={jouneyGroup.map(journey => journey.geoLocationDto)}
                        options={{ strokeColor: color }}
                    />
                );
            }
        }

        return lines;
    }

    return <>
        {drawMarkers(selectedTravel)}
        {drawLine(selectedTravel)}
    </>

}


/**
 *
 * @param {{"journey": Journey}} props
 */
function PhotoMarker(props) {
    const { journey } = props;
    const [isShow, _setShow] = useState(false);

    const show = () => _setShow(true);
    const hide = () => _setShow(false);

    return <Marker
        position={journey.geoLocationDto}
        onClick={show}
    >
        {
            isShow &&
            <InfoWindow position={journey.geoLocationDto} onCloseClick={hide}>
                <div>
                    <h3>{journey.geoLocationDto.name}</h3>
                    {journey.photos.map(img => InfoWindowImage(img))}
                </div>
            </InfoWindow>
        }
    </Marker>;
}

function InfoWindowImage(img) {
    // TODO: fix style
    return <img src={img.src} alt={img} width={100} />;
}