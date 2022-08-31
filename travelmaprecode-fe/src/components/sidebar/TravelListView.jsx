import React from 'react'

export default function TravelListView() {
    return (
        <ul id='sidebar-list-div' className="flex-column mb-auto list-unstyled ps-0">
            <div id='sidebar-travel-div'>
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
                        2022년 유럽여행
                    </button>
                    <div className="collapse show" id="home-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" className="link-dark rounded">영국 1일차 런던</a></li>
                            <li><a href="#" className="link-dark rounded">영국 2일차 세븐 시스터즈</a></li>
                            <li><a href="#" className="link-dark rounded">영국 3일차 옥스포드</a></li>
                        </ul>
                    </div>
                </li>
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
                        2013년 일본 여행
                    </button>
                    <div className="collapse" id="dashboard-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" className="link-dark rounded">오사카</a></li>
                            <li><a href="#" className="link-dark rounded">교토</a></li>
                            <li><a href="#" className="link-dark rounded">우지 녹차마을</a></li>
                        </ul>
                    </div>
                </li>
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">
                        2044년 미국 여행
                    </button>
                </li>
            </div>
        </ul>
    )
}
