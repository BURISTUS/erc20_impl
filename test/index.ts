import chai, { expect } from "chai";
import {ethers} from "hardhat";
import {Contract} from "ethers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {solidity} from "ethereum-waffle";

chai.use(solidity);

describe("RinusToken contract", function(){
    let RinusToken;
    let RinusTokenInterface: Contract;
    let owner: SignerWithAddress;
    let acc1: SignerWithAddress;
    let acc2: SignerWithAddress;
    let totalSupplyOfTokens = '10000000000';

    beforeEach(async function(){
        RinusToken = await ethers.getContractFactory("RinusToken");
        [owner, acc1, acc2] = await ethers.getSigners();
        RinusTokenInterface = await RinusToken.deploy();
        await RinusTokenInterface.deployed();
    })

    async function getAccountBalance(account: SignerWithAddress): Promise<string> {
        const address = await account.getAddress();
        const rawBalance = await ethers.provider.getBalance(address);
        const welBalance = await ethers.utils.formatUnits(rawBalance, 0);
        return welBalance
    }

    describe("Starter data", function (){
        it("Should return token name", async function(){
            expect(await RinusTokenInterface.name()).to.equal("RinusToken")
        })

        it("Should return token symbol", async function(){
            expect(await RinusTokenInterface.symbol()).to.equal("RINC")
        })

        it("Should return token owner address", async function(){
            expect(await RinusTokenInterface.owner()).to.equal(await owner.getAddress())
         })

        it("Should return starting tokken supply", async function(){
            let totalSupply = await RinusTokenInterface.totalSupply();
            totalSupply = ethers.utils.formatUnits(totalSupply, 0);
            expect(totalSupply).to.equal(totalSupplyOfTokens)
        })

        it("Should return decimals of token", async function(){
            let decimals = await RinusTokenInterface.decimals()
            decimals = ethers.utils.formatUnits(decimals, 0);
            expect(decimals).to.equal("8");
        })
    })

    describe("Mint function", function(){
        it("Mint", async function() {
            const mint = await RinusTokenInterface.connect(owner).mint(owner.address, 100000);
            await mint.wait();
            let mintResult = await RinusTokenInterface.tokenSupply()
            mintResult = ethers.utils.formatUnits(mintResult, 0)
            expect(mintResult).to.equal("10000100000")
        })
    })

    describe("Transfer function", function() {
        it("Transfer", async function(){
            const transfer = await RinusTokenInterface.connect(owner).transfer(acc2.address, 100000);
            await transfer.wait();
            let transferResult = await RinusTokenInterface.balanceOf(acc2.address)
            transferResult = ethers.utils.formatUnits(transferResult, 0)
            expect(transferResult).to.equal("100000")
        })
    })

    describe("Burn function", function(){
        it("Burn", async function(){
            await RinusTokenInterface.connect(owner).transfer(acc1.address, 100000)
            const burn = await RinusTokenInterface.connect(acc1).burn(95000)
            await burn.wait()
            let burnResult = await RinusTokenInterface.tokenSupply()
            burnResult = ethers.utils.formatUnits(burnResult, 0)
            expect(burnResult).to.equal("9999905000")
        })
    })
})
