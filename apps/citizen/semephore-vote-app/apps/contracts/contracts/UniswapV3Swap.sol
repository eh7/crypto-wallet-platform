// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// https://blockchain.oodles.io/dev-blog/swap-tokens-on-uniswap-v3/

import "https://github.com/Uniswap/swap-router-contracts/blob/main/contracts/interfaces/ISwapRouter02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UniswapV3Swap {

    address public SWAP_ROUTER_02;
    address public WETH;
    address public DAI;
    address public USDC;

    ISwapRouter02 private router = ISwapRouter02(SWAP_ROUTER_02);
    IERC20 private weth = IERC20(WETH);
    IERC20 private dai = IERC20(DAI);

    constructor(
        address _swapRouter,
        address _weth,
        address _dai,
        address _usdc
    ) {
        SWAP_ROUTER_02 = _swapRouter;
        WETH = _weth;
        DAI = _dai;
        USDC = _usdc;
    }

    function swapExactInputSingle(uint256 amountIn, uint256 amountOutMin)
        external
    {
        weth.transferFrom(msg.sender, address(this), amountIn);
        weth.approve(address(router), amountIn);

        ISwapRouter02.ExactInputSingleParams memory params = IV3SwapRouter
            .ExactInputSingleParams({
            tokenIn: WETH,
            tokenOut: DAI,
            fee: 3000,
            recipient: msg.sender,
            amountIn: amountIn,
            amountOutMinimum: amountOutMin,
            sqrtPriceLimitX96: 0
        });

        router.exactInputSingle(params);
    }

    function swapExactOutputSingle(uint256 amountOut, uint256 amountInMax)
        external
    {
        weth.transferFrom(msg.sender, address(this), amountInMax);
        weth.approve(address(router), amountInMax);

        ISwapRouter02.ExactOutputSingleParams memory params = IV3SwapRouter
            .ExactOutputSingleParams({
            tokenIn: WETH,
            tokenOut: DAI,
            fee: 3000,
            recipient: msg.sender,
            amountOut: amountOut,
            amountInMaximum: amountInMax,
            sqrtPriceLimitX96: 0
        });

        uint256 amountIn = router.exactOutputSingle(params);

        if (amountIn < amountInMax) {
            weth.approve(address(router), 0);
            weth.transfer(msg.sender, amountInMax - amountIn);
        }
    }

    function swapExactInputMultiStep(uint256 amountIn, uint256 amountOutMin)
        external
    {
        weth.transferFrom(msg.sender, address(this), amountIn);
        weth.approve(address(router), amountIn);

        bytes memory path =
            abi.encodePacked(WETH, uint24(3000), USDC, uint24(100), DAI);

        ISwapRouter02.ExactInputParams memory params = IV3SwapRouter
            .ExactInputParams({
            path: path,
            recipient: msg.sender,
            amountIn: amountIn,
            amountOutMinimum: amountOutMin
        });

        router.exactInput(params);
    }

    function swapExactOutputMultiStep(uint256 amountOut, uint256 amountInMax)
        external
    {
        weth.transferFrom(msg.sender, address(this), amountInMax);
        weth.approve(address(router), amountInMax);

        bytes memory path =
            abi.encodePacked(DAI, uint24(100), USDC, uint24(3000), WETH);

        ISwapRouter02.ExactOutputParams memory params = IV3SwapRouter
            .ExactOutputParams({
            path: path,
            recipient: msg.sender,
            amountOut: amountOut,
            amountInMaximum: amountInMax
        });

        uint256 amountIn = router.exactOutput(params);

        if (amountIn < amountInMax) {
            weth.approve(address(router), 0);
            weth.transfer(msg.sender, amountInMax - amountIn);
        }
    }
}

