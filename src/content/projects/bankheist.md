---
title: "BankHeist"
titleSuffix: "BankHeist"
routeKey: bankheist
route: /bankheist.html
legacySource: bankheist.html
year: 2020
listingTitle: "💸 BankHeist"
listingSubtitle: "IoT, socket.io, express.js, crypto.js, electron.js, serialport.io"
listingImage: "project/bankheist/thumb_crop.png"
listingImageAlt: "bankheist"
listingHref: "bankheist.html"
listingOrder: 20
detailNavOrder: 20
status: migrated
summary: "Project detail page for BankHeist."
socialImage: "https://jasontsemf.github.io/project/bankheist/thumb_crop.png"
socialDescription: "Creative Technologist"
socialCard: summary_large_image
includeCocoenAssets: false
---
<div class="jason-narrow-content-top">
    <div class="row">
        <div class="col-md-12 animate-box" data-animate-effect="fadeInLeft">
            <div class="text-center videoBox">
                <!-- <ismg src="project/falseawakening/false_awakening_title.png" alt="falseawakening" class="img-responsive"> -->
                <div style="position: relative; padding-bottom: 50%;">
                    <iframe class="img-responsive img-responsive-shadow jason-youtube-video-wide"
                        src="https://www.youtube.com/embed/wwdG1mgFPkc" frameborder="0" gesture="media"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                </div>
            </div>
        </div>
        <!-- <div class="col-md-12 animate-box" data-animate-effect="fadeInLeft">
            <figure class="text-center">
                <img src="project/bankheist/thumb.png" alt="bankheist"
                    class="img-responsive img-responsive-shadow"
                    style="margin-left: auto; margin-right: auto;">
            </figure>
        </div> -->

        <div class="col-md-8 col-md-offset-2 animate-box" data-animate-effect="fadeInLeft">
            <h1>💸 BankHeist</h1>
            <p>
                "Signing physical documents remotely over the internet in real time."
            </p>
        </div>
        <div class="col-md-8 col-md-offset-2 animate-box" data-animate-effect="fadeInLeft">
            <h3>
                <i class="icon-globe github-code"></i>
                <a href="https://bankheist.onrender.com/" target="_blank">
                    Live on Render
                </a>
            </h3>
            <h3>
                <i class="icon-github github-code"></i>
                <a href="https://github.com/jasontsemf/BankHeist" target="_blank">
                    Project and README on GitHub
                </a>
            </h3>
        </div>
    </div>
</div>
<div class="jason-narrow-content jason-border-bottom">
    <div class="row">
        <div class="col-md-3 animate-box" data-animate-effect="fadeInLeft">
            <h2>The Problem</h2>
            <p><strong>Let's face it. DocuSign seems to be the most modern signing solution out there.
                    However, it is fundamentally flawed in my opinion.</strong> </p>
        </div>
        <div class="col-md-9 animate-box" data-animate-effect="fadeInLeft">
            <p>
                Not to be mistaken, the idea of e-signature is smart. Ultimately, digital documents are
                meant to be signed electronically/digitally. Due to its digital nature, you can always send
                them over the internet, and retrieve them virtually anywhere. No more papers, more
                environmental friendly. <strong>HOWEVER</strong>, how is an e-signature "a person's name
                written in a
                <strong>distinctive way</strong> as a form of identification in authorizing a check or
                document" (according
                to the Oxford dictionary), when you can easily "steal" someone else's signature with a phone
                camera, then import and paste them onto the PDF with a press of a button labeled "click to
                sign", <strong>behind a screen</strong>, without a person's direct biometric input.
            </p>
            <p>
                In fact, there are still many reasons supporting that argument that a <strong>"wet
                    signature" is indispensable and inevitable</strong>. In 2016, The
                United States Trustee (UST) sanctioned a Sacramento-based lawyer, citing Local Bankruptcy
                Rules [9004-1(c)(1)(C) and (D)] which state that an electronically signed document can only
                be used where a copy of the document with an original signature (“wet signature”) is also
                available. DocuSign fell short by failing to prove to the courts that the signature truly
                counted as an original signature. Indeed, like I argued, a fatal flaw that will defeat all
                digital signature platforms.
            </p>
            <p>
                Legal concerns aside, real life business workflows and needs might be some other reasons why
                e-signature is not completely adopted. Unfortunately, sticking to old school loses all the
                convenience, secure digital encryption that digital signature offers. Especially during
                <strong>COVID-19</strong>, it became impossible to have physical documents signed, no matter
                it is the
                situation of working remotely from home, or not be able to make business trip.
            </p>
        </div>
    </div>
</div>
<div class="jason-narrow-content  jason-border-bottom">
    <div class="row">
        <div class="col-md-8 col-md-offset-2 animate-box" data-animate-effect="fadeInLeft">
            <h2>The Solution</h2>
        </div>
        <div class="col-md-8 col-md-offset-2 animate-box" data-animate-effect="fadeInLeft">
            <p>
                To pull off a remote wet signature, a tangible network interface/system is needed to bridge
                the gap between the virtual and physical world. The signature produced by the solution
                should hold better originality, authenticity and credibility when it is compared to a
                e-signature. Meanwhile, the solution is going to retain the convenience and secure
                encryption of being remote and virtual.
            </p>
        </div>
        <!-- <p>
            <img src="project/pbc/pbc_thumb_bumbed.png" alt="pbc thumb" class="img-responsive animate-box"
                data-animate-effect="fadeInLeft">
        </p> -->
    </div>
    <div class="row">
        <div class="col-md-12 animate-box" data-animate-effect="fadeInLeft">
            <h3>The Components</h3>
        </div>
        <div class="col-md-12 animate-box" data-animate-effect="fadeInLeft">
            <div class="col-md-4 jason-staff animate-box" data-animate-effect="fadeInLeft">
                <img src="project/bankheist/clients.png" alt="clients"
                    class="img-responsive img-responsive-shadow">
                <div class="jason-captionpad">
                    <h3>Web Signing Platform</h3>
                    <p class="jason-caption">The secure platform where the receiver creates meeting rooms
                        and
                        invite signers to sign with either a tablet with a stylus or a typical computer with
                        a mouse/touchpad.
                    </p>
                </div>
            </div>
            <div class="col-md-4 jason-staff animate-box" data-animate-effect="fadeInLeft">
                <img src="project/bankheist/axidraw.jpg" alt="tag"
                    class="img-responsive img-responsive-shadow">
                <div class="jason-captionpad">
                    <h3>AxiDraw</h3>
                    <p class="jason-caption">The receiver needs a machine that signs with digital input from
                        the signer. AxiDraw is a great CNC drawing machine that
                        draws with high precision via a USB to Serial interface
                    </p>
                </div>
            </div>
            <div class="col-md-4 jason-staff animate-box" data-animate-effect="fadeInLeft">
                <img src="project/bankheist/serial.png" alt="app mockup"
                    class="img-responsive img-responsive-shadow">
                <div class="jason-captionpad">
                    <h3>Serial Desktop App</h3>
                    <p class="jason-caption">For the receiver side, a desktop app for talking to the AxiDraw
                        is needed to be installed locally to drive the machine. The web app will pass
                        signing data to the serial app, and get the signature signed with the AxiDraw.</p>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="jason-cards">
    <div class="jason-narrow-content">
        <div class="row">
            <div class="col-md-8 col-md-offset-2 animate-box" data-animate-effect="fadeInLeft">
                <h3>How it Works</h3>
                <p>
                    <img src="project/bankheist/systemdiagram.png" alt="system diagram"
                        class="img-responsive work-item animate-box" data-animate-effect="fadeInLeft">
                </p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8 col-md-offset-2 animate-box" data-animate-effect="fadeInLeft">
                <p>
                    Prior to a signing session on BankHeist, the signer and the receiver exchange
                    authentication details such as room name and password over a third-party video call
                    (e.g. Zoom). Then, BankHeist connects the signer and the receiver with a secure virtual
                    signing room, leveraging <a href="https://socket.io/">Socket.io</a> and <a
                        href="https://www.npmjs.com/package/crypto-js">Crypto.js</a> technology. The
                    password(key) will be
                    always encrypted locally with Advanced Encryption Standard (AES), so that the true
                    password will never exist
                    on the internet.
                </p>
                <p>
                    The strokes of the digital signature captured with <a href="https://p5js.org/">P5.js</a>
                    on the signer's end will be
                    transferred to the receiver's end over the Socket.io connection. In real time, the
                    receiver's computer retrieve the coordinates, then talks to the local <a
                        href="https://www.electronjs.org/">Electron.js</a> app,
                    by forwarding the data via the localhost endpoint served by <a
                        href="https://expressjs.com/">Express.js</a>. The app
                    translates the data into serial commands, send it to the AxiDraw machine over a USB
                    connection, utilizing the <a href="https://serialport.io/">SerialPort</a> Node.js
                    library. As such, pixels on signer's screen
                    are finally being converted into a physical signature on a piece of paper.
                </p>
                <p>
                    Over the course of the signing session, the receiver and the signer will still be
                    connected with the video conference call to prove their physical presence.
                </p>
                <p>
                    BankHeist not only makes this unprecedented remote physical documents signing experience
                    possible, but it also adds an extra layer of authenticity, security to the entire
                    signature process. While it is creating a "wet signature" that DocuSign can never pull
                    off, it preserves the unique convenience that the internet offers.
                </p>
                <p>
                    For further technical specifications, please proceed to the <a
                        href="https://github.com/jasontsemf/BankHeist">Project on GitHub</a>.
                </p>
            </div>
        </div>
    </div>
</div>
<div class="jason-narrow-content jason-border-bottom">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="animate-box" data-animate-effect="fadeInLeft">
                <h2>Credits</h2>
                <p>
                    This is a project in collaboration with <a href="https://www.melpowers.com/">Melissa
                        Powers</a>, for the ITP class "Understanding Networks" by <a
                        href="https://github.com/tigoe">Tom Igoe</a>.
                </p>
            </div>
        </div>
    </div>
</div>

<div class="jason-narrow-content  animate-box" data-animate-effect="fadeInLeft">
    <div class="animate-box" data-animate-effect="fadeInLeft">
        <div class="col-md-8 col-md-offset-2 col-sm-12 col-sm-offset-0">
            <div class="col-md-4 col-sm-4 col-md-offset-4 col-xs-4 text-center">
                <h4>2020 Winter</h4>
            </div>
        </div>
    </div>
    <!-- PROJECT_DETAIL_NAV -->
</div>
</div>
