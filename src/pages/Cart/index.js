import classNames from "classnames/bind";
import { Container, Row, Col } from "react-bootstrap";
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify"
import { useEffect } from "react";
import { AiOutlineInbox } from "react-icons/ai";

import { userPut } from "~/redux/userSlice";
import { getTotal } from '~/redux/userSlice';
import Pageing from "~/components/Pageing";
import Product from "~/components/Product";
import Button from "~/components/Button";
import style from './Cart.module.scss';
const cx = classNames.bind(style)
function Cart() {

    const dispath = useDispatch()
    const isMobile = useMediaQuery({ query: '(max-width: 426px)' })
    const cart = useSelector(state => state.user.value.cart)
    const user = useSelector(state => state.user.value)
    const { cartTotalAmount } = useSelector(state => state.user.value.cart)

    useEffect(() => {
        dispath(getTotal(null));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart])

    useEffect(() => {
        document.title = 'Your Cart'
    }, [])

    const handleUpdate = () => {
        dispath(userPut(user))
        toast.success(`Updated your shopping cart`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const handleClear = () => {
        const cart = {
            cartItems: [],
            cartTotalAmount: 0,
            cartTotalQuantity: 0,
        }
        const newUser = { ...user, cart }
        dispath(userPut(newUser))
        toast.error(`Cleared shopping cart`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const checkoutItems = [
        {
            title: "Subtotal",
            ship: cart.cartItems.length > 0 ? `$${cartTotalAmount}` : 0
        },
        {
            title: "Shipping",
            ship: "$21.00"
        },
        {
            title: "Tax",
            ship: "$1.91"
        },
        {
            title: "Order Total",
            ship: cart.cartItems.length > 0 ? `$${cartTotalAmount + 21 + 1.91}` : 0
        }
    ]

    return (
        <Container className={cx('wrapper')}>
            <Pageing pages={["Cart"]} />
            <h1 className={cx('Cart-Head')}>Shopping Cart</h1>
            {cart.cartItems.length > 0 ? (
                <Row>
                    <Col lg={9} sm={12}>
                        {
                            !isMobile &&
                            <div className={cx('titles')}>
                                <Row>
                                    <Col md={2}>Item</Col>
                                    <Col md={4}></Col>
                                    <Col md={2}>Price</Col>
                                    <Col md={1}>Quanty</Col>
                                    <Col md={2}>Subtotal</Col>
                                    <Col md={1}></Col>
                                </Row>
                            </div>
                        }
                        {cart.cartItems.map(product => (
                            <Product isInCart key={product.id} data={product} />
                        ))}
                        <div className={cx('buttons')}>
                            <Button to='/' outlineGray>Continue Shopping</Button>
                            <Button onClick={handleClear} black>Clear Shopping Cart</Button>
                            <Button onClick={handleUpdate} black>Update Shopping Cart</Button>
                        </div>
                    </Col>

                    <Col lg={3} sm={12} className={cx('right')}>
                        <h1 className={cx('right-head')}>Summary</h1>
                        <ul className={cx('menu')}>
                            {
                                checkoutItems.map((item, index) => (
                                    <li key={index}>
                                        <h2>{item.title}</h2>
                                        <span>{item.ship}</span>
                                    </li>
                                ))
                            }
                        </ul>
                        <Button primary>Proceed to Checkout</Button>
                    </Col>
                </Row>

            ) : (
                <div className={cx('nodata')}>
                    <AiOutlineInbox />
                    <h1>No data</h1>
                </div>
            )}
        </Container>
    );
}

export default Cart;