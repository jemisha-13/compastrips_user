import React from 'react'
import PopularDestination from './popular-destination/PopularDestination';
import PopulatHost from './popular-host/PopulatHost';
import Tourlist from './tourcard/Tourlist';



const HomePage: React.FC = () => {

    return (
        <>
            <div>
                {/* <Hero date={new Date()} handleDateSelect={handleDateSelect} handleDateChange={handleDateChange} /> */}
                {/* <Hero /> */}
            </div>

            <div className="bottom-hero-content main-container">
                <div className="custom-flex-margin d-flex">
                    <div className="p-0 sidebar-homepage">
                        <div className="home-sidebar">
                            <div className="PopularDestination">
                                <PopularDestination />
                            </div>
                            <div className="PopulatHost">
                                <PopulatHost />
                            </div>
                        </div>

                    </div>
                    <div className="tour-lists ">
                        <Tourlist />
                    </div>



                </div>
            </div>
        </>
    )
}

export default HomePage
