import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";

const FooterPage = () => {
    return (
        <MDBFooter color="white" className="font-small pt-4 mt-4 bg-dark">
            <div className="footer-copyright text-center py-3">
                <MDBContainer color="white"  fluid>
                    <p style={{color:'white'}}>&copy; {new Date().getFullYear()} Copyright: <a style={{color:'white'}}  href="https://www.DXC.com"> DXC Technologies </a></p>
                </MDBContainer>
            </div>
        </MDBFooter>
    );
}
export default FooterPage;
