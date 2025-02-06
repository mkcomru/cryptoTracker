import CryptoCurrencyCard from '../../components/CryptoCurrencyCard/CryptoCurrencyCard'
import { Spin } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styles from './CryptoPage.module.css'
import MyMenu from '../../components/Menu/Menu'

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    }
}

function CryptoPage() {

    const [currencies, setCurrencies] = useState([])
    const [currencyId, setCurrencyId] = useState(1)
    const [currencyData, setCurrencyData] = useState(null)

    const fetchCurrencies = () => {
        axios.get('http://127.0.0.1:8000/cryptocurrencies').then((response) => {
            const currensiesResponse = response.data
            const menuItems = [
                getItem('Список Криптовалют', 'g1', null, 
                    currensiesResponse.map((currency) => {
                        return {label: currency.name, key: currency.id}
                    }),
                    'group'
                )
            ]
            setCurrencies(menuItems)
        })
    }   

    const fetchCurrency = () => {
        axios.get(`http://127.0.0.1:8000/cryptocurrencies/${currencyId}`).then((response) => {
            setCurrencyData(response.data)
        })
    }

    useEffect(() => {
        fetchCurrencies()
    }, [])

    useEffect(() => {
        setCurrencyData(null)
        fetchCurrency()
    }, [currencyId])

    const onClick = (e) => {
        setCurrencyId(e.key)
    }

    return (
        <div className={styles.container}>
            <MyMenu currencies={currencies} onClick={onClick} />
            <div className={styles.card}>
                {currencyData ? <CryptoCurrencyCard currency={currencyData} /> : <Spin size="large" />}
            </div>
        </div>
    )
}

export default CryptoPage