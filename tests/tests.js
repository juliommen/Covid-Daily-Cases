const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect
const baseUrl = "https://coviddailycases.us-south.cf.appdomain.cloud"

chai.use(chaiHttp);

var test_cases_for_valide_date = [
    '/cases/2020-06-22/',
    '/cases/2020-09-28/',
    '/cases/2021-03-22/',
    '/cases/2021-05-17/',
    '/cases/2021-12-13/',
];

var test_cases_for_invalid_date = [
    '/cases/20201230/',
    '/cases/2020123/',
    '/cases/xyzxyz/',
    '/cases/2020-13-30/',
    '/cases/202012-30/',
    '/cases/2020-12-32/',
    '/cases/25-05-2020/',
    '/cases/05-25-2020/',
];

//Main Route
describe("Main Route Test", function(){
    it('server is live', function (done) {
        this.timeout(10000);
        chai.request(baseUrl)
        .get('/')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body.msg).to.equal("Backend Challenge 2022 🏅 - Covid Daily Cases");
            done();
        });
    })
})

//Dates route
describe("Available dates route test", function () {
    it('server is live', function (done) {
        this.timeout(10000);
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
    test_cases_for_valide_date.forEach((test_case) => {
        it('server is live', function (done) {
            this.timeout(10000);
            chai.request(baseUrl)
                .get(test_case+'count')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.date).to.equal(test_case.slice(7,17));
                    done();
                });
        })
    });
})

describe("Count cases route test - No data found", function () {
    it('server is live', function (done) {
        this.timeout(10000);
        chai.request(baseUrl)
            .get('/cases/2023-05-11/count')
            .end(function (err, res) {
                expect(res).to.have.status(404);
                expect(res.body.error_msg).to.equal("No data found for this particular date. Find available dates accessing the route '/dates'.");
                done();
            });
    })
})

describe("Count cases route test - Invalid date", function () {
    test_cases_for_invalid_date.forEach((test_case) => {
        it('server is live', function (done) {
            this.timeout(10000);
            chai.request(baseUrl)
                .get(test_case + "count")
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body.error_msg).to.equal("Invalid date input. Use this format: 'yyyy-mm-dd'.");
                    done();
                });
        })
    });
})

//Cumulative route
describe("Accumulated cases route test - OK", function () {
    test_cases_for_valide_date.forEach((test_case) => {
        it('server is live', function (done) {
            this.timeout(10000);
            chai.request(baseUrl)
                .get(test_case + 'cumulative')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.date).to.equal(test_case.slice(7, 17));
                    done();
                });
        })
    });
})

describe("Accumulated cases route test - No data found", function () {
    it('server is live', function (done) {
        this.timeout(10000);
        chai.request(baseUrl)
            .get('/cases/2019-01-05/cumulative')
            .end(function (err, res) {
                expect(res).to.have.status(404);
                expect(res.body.error_msg).to.equal("No data found until this particular date. Find available dates accessing the route '/dates'.");
                done();
            });
    })
})

describe("Accumulated cases route test - Invalid date", function () {
    test_cases_for_invalid_date.forEach((test_case) => {
        it('server is live', function (done) {
            this.timeout(10000);
            chai.request(baseUrl)
                .get(test_case+"cumulative")
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body.error_msg).to.equal("Invalid date input. Use this format: 'yyyy-mm-dd'.");
                    done();
                });
        })
    });
})