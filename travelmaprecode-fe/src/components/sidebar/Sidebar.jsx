import React from 'react'
import './Sidebar.css'

export default function Sidebar() {
    return (
        <div className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-white" style={{ width: 280 + 'px' }}>
            <a href="/" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
                {/* <svg className="bi me-2" width="30" height="24"><use xlink:href="#bootstrap" /></svg> */}
                <span className="fs-5 fw-semibold">Travel Map Record</span>
            </a>
            <ul id='sidebar-list-div' className="flex-column mb-auto list-unstyled ps-0">
                {/* <div id='sidebar-travel-div'>
                    <li className="mb-1">
                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
                            Home
                        </button>
                        <div className="collapse show" id="home-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li><a href="#" className="link-dark rounded">Overview</a></li>
                                <li><a href="#" className="link-dark rounded">Updates</a></li>
                                <li><a href="#" className="link-dark rounded">Reports</a></li>
                            </ul>
                        </div>
                    </li>
                    <li className="mb-1">
                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
                            Dashboard
                        </button>
                        <div className="collapse" id="dashboard-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li><a href="#" className="link-dark rounded">Overview</a></li>
                                <li><a href="#" className="link-dark rounded">Weekly</a></li>
                                <li><a href="#" className="link-dark rounded">Monthly</a></li>
                                <li><a href="#" className="link-dark rounded">Annually</a></li>
                            </ul>
                        </div>
                    </li>
                    <li className="mb-1">
                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">
                            Orders
                        </button>
                        <div className="collapse" id="orders-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li><a href="#" className="link-dark rounded">New</a></li>
                                <li><a href="#" className="link-dark rounded">Processed</a></li>
                                <li><a href="#" className="link-dark rounded">Shipped</a></li>
                                <li><a href="#" className="link-dark rounded">Returned</a></li>
                            </ul>
                        </div>
                    </li>
                </div> */}
                <div className='sidebar-stratch'></div>

                <div id='sidebar-user-div'>

                    <li className="border-top my-3"></li>
                    <li className="mb-1">
                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded="false">
                            Account
                        </button>
                        <div className="collapse" id="account-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li><a href="#" className="link-dark rounded">New...</a></li>
                                <li><a href="#" className="link-dark rounded">Profile</a></li>
                                <li><a href="#" className="link-dark rounded">Settings</a></li>
                                <li><a href="#" className="link-dark rounded">Sign out</a></li>
                            </ul>
                        </div>
                    </li>
                </div>
            </ul>

            <div class="dropdown">
                <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2" />
                    <strong>mdo</strong>
                </a>
                <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                    <li><a class="dropdown-item" href="#">New project...</a></li>
                    <li><a class="dropdown-item" href="#">Settings</a></li>
                    <li><a class="dropdown-item" href="#">Profile</a></li>
                    <li><hr class="dropdown-divider" /></li>
                    <li><a class="dropdown-item" href="#">Sign out</a></li>
                </ul>
            </div>
        </div>
    )
}
