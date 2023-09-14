import React, { useState } from "react";
import { Modal } from "antd";

const TermsAndConditionsModal = ({ visible, onClose }) => {
    return (
        <Modal
            title="Terms and Conditions"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            {/* Content of the modal */}
            <h3>1. Your Agreement</h3>
            <p>1.1 This website www.withinsg.com and/or the WithinSG App (together, 'WithinSG Platform') is operated by WithinSG
                Travel Technology Limited, a Singapore incorporated company. Please read these terms of use (“this Terms of Use”)
                carefully before using the WithinSG Platform and the services offered by WithinSG Travel Technology Limited, its affiliated
                companies (together, “WithinSG”) or the third-party operators (the “Operator”) through the WithinSG Platform (the “Services”).
                “You” and “your” when used in this Terms of Use includes (1) any person who accesses the WithinSG Platform and (2) persons
                for whom you make a purchase of the Services.
            </p>
            <h3>2. Change of Terms of Use</h3>
            <p>2.1 WithinSG reserves the right, at its sole discretion, to change or modify any part of this Terms of Use at any time without
                prior notice. You should visit this page periodically to review the current Terms of Use to which you are bound. If WithinSG
                changes or modifies this Terms of Use, WithinSG will post the changes to or modifications of this Terms of Use on this page and
                will indicate at the bottom of this page the date on which this Terms of Use was last revised.
            </p>
            <p>2.2 Your continued use of the WithinSG Platform after any such changes or modifications constitutes your acceptance of the
                revised Terms of Use. If you do not agree to abide by the revised Terms of Use, do not use or access or continue to use
                or access the WithinSG Platform and/or the Services. It is your responsibility to regularly check the WithinSG Platform to
                ascertain if there are any changes to this Terms of Use and to review such changes.
            </p>
            <p>
                2.3 In addition, when using the Services, you shall be subject to any additional terms applicable to such
                Services that may be posted on the page relating to such Services from time to time, the privacy policy
                (the “Privacy Policy”) and the terms and conditions of WithinSG AI tools (the “Terms and Conditions of WithinSG
                AI Tools”) adopted by WithinSG from time to time. All such terms are hereby expressly incorporated by reference
                in this Terms of Use.
            </p>
            <h3>3. Access and Use of the Services</h3>
            <p>
                3.1 This WithinSG Platform, the domain name (www.WithinSG.com), subdomains, features, contents and application services
                (including without limitation to any mobile application services) offered periodically by WithinSG in connection therewith
                are owned and operated by WithinSG.
            </p>
            <p>
                3.2 Subject to this Terms of Use, WithinSG may either offer to provide the Services by itself or on behalf of the Operators, as
                described in further detail on the WithinSG Platform. The Services that have been selected by you on the WithinSG Platform are solely
                for your own use, and not for the use or benefit of any third party. The term "Services" includes but is not limited to the use
                of the WithinSG Platform, any Services offered by WithinSG by itself or on behalf of the Operators on the WithinSG Platform. WithinSG may
                change, suspend or discontinue any Services at any time, including the availability of any feature, database or content. WithinSG
                may also impose limits or conditions on certain Services or restrict your access to any part or all of the Services without notice
                or liability.
            </p>
            <p>
                3.3 WithinSG does not guarantee that the Services will always be available or uninterrupted. WithinSG will not be liable to you
                if for any reason the Services are unavailable at any time or for any period. You are responsible for making all
                arrangements necessary for you to have access to the Services. You are also responsible for ensuring that all persons
                who access the Services through Internet connection are aware of this Terms of Use and other applicable terms and
                conditions for the Services, and that they comply with them.
            </p>
            <i>Last updated on 14 Sep 2023.</i>
        </Modal>
    );
};

export default TermsAndConditionsModal;