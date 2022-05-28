const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect
const baseUrl = "https://coviddailycases.us-south.cf.appdomain.cloud"

chai.use(chaiHttp);

//Main Route
describe("Main Route Test", function(){
    it('server is live', function (done) {
        this.timeout(5000);
        chai.request(baseUrl)
        .get('/')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body.msg).to.equal("Backend Challenge 2022 🏅 - Covid Daily ");
            done();
        });
    })
})

//Dates route
describe("Available dates route test", function () {
    it('server is live', function (done) {
        this.timeout(5000);
        chai.request(baseUrl)
            .get('/dates')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.available_dates.length).to.equal(45);
                done();
            });
    })
})

//Count rote
describe("Count cases route test - OK", function () {
    it('server is live', function (done) {
        this.timeout(5000);
        chai.request(baseUrl)
            .get('/cases/2020-05-11/count')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.date).to.equal("2020-05-11");
                done();
            });
    })
})

describe("Count cases route test - No data", function () {
    it('server is live', function (done) {
        this.timeout(5000);
        chai.request(baseUrl)
            .get('/cases/2023-05-11/count')
            .end(function (err, res) {
                expect(res).to.have.status(404);
                expect(res.body.error_msg).to.equal("No data found for this particular date. Find available dates accessing the route '/dates'.");
                done();
            });
    })
})

describe("Count cases route test - Invalid date 1", function () {
    it('server is live', function (done) {
        this.timeout(5000);
        chai.request(baseUrl)
            .get('/cases/2020-13-11/count')
            .end(function (err, res) {
                expect(res).to.have.status(400);
                expect(res.body.error_msg).to.equal("Invalid date input. Use this format: 'yyyy-mm-dd'.");
                done();
            });
    })
})

describe("Count cases route test - Invalid date 2", function () {
    this.timeout(5000);
    it('server is live', function (done) {
        this.timeout(5000);
        chai.request(baseUrl)
            .get('/cases/2020-12-32/count')
            .end(function (err, res) {
                expect(res).to.have.status(400);
                expect(res.body.error_msg).to.equal("Invalid date input. Use this format: 'yyyy-mm-dd'.");
                done();
            });
    })
})

describe("Count cases route test - Invalid date 3", function () {
    it('server is live', function (done) {
        this.timeout(5000);
        chai.request(baseUrl)
            .get('/cases/20201230/count')
            .end(function (err, res) {
                expect(res).to.have.status(400);
                expect(res.body.error_msg).to.equal("Invalid date input. Use this format: 'yyyy-mm-dd'.");
                done();
            });
    })
})

//Accumulated route
describe("Accumulated cases route test - OK", function () {
    it('server is live', function (done) {
        this.timeout(5000);
        chai.request(baseUrl)
            .get('/cases/2022-01-05/cumulative')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.date).to.equal("2022-01-05");
                done();
            });
    })
})

describe("Accumulated cases route test - No data", function () {
    it('server is live', function (done) {
        this.timeout(5000);
        chai.request(baseUrl)
            .get('/cases/2019-01-05/cumulative')
            .end(function (err, res) {
                expect(res).to.have.status(404);
                expect(res.body.error_msg).to.equal("No data found until this particular date. Find available dates accessing the route '/dates'.");
                done();
            });
    })
})

describe("Accumulated cases route test - Invalid date 1", function () {
    it('server is live', function (done) {
        this.timeout(5000);
        chai.request(baseUrl)
            .get('/cases/2020-13-11/cumulative')
            .end(function (err, res) {
                expect(res).to.have.status(400);
                expect(res.body.error_msg).to.equal("Invalid date input. Use this format: 'yyyy-mm-dd'.");
                done();
            });
    })
})

describe("Accumulated cases route test - Invalid date 2", function () {
    it('server is live', function (done) {
        this.timeout(5000);
        chai.request(baseUrl)
            .get('/cases/2020-12-32/cumulative')
            .end(function (err, res) {
                expect(res).to.have.status(400);
                expect(res.body.error_msg).to.equal("Invalid date input. Use this format: 'yyyy-mm-dd'.");
                done();
            });
    })
})


describe("Accumulated cases route test - Invalid date 3", function () {
    it('server is live', function (done) {
        this.timeout(5000);
        chai.request(baseUrl)
            .get('/cases/20201230/cumulative')
            .end(function (err, res) {
                expect(res).to.have.status(400);
                expect(res.body.error_msg).to.equal("Invalid date input. Use this format: 'yyyy-mm-dd'.");
                done();
            });
    })
})