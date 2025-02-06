import { Card } from 'antd'
import PropTypes from 'prop-types'
import styles from './CryptoCurrencyCard.module.css'

function CryptoCurrencyCard(props) {
    const { currency } = props
    const price = (Math.round(currency.quote.USD.price)).toLocaleString('en-EN')
    const priceChange = currency.quote.USD.percent_change_24h.toFixed(2)
    const capitalization = formatCapitalization(currency.quote.USD.market_cap)

    if (!currency) {
        return null; 
    }

    return (
        <Card
            title={
                <div className={styles.cardTitle}>
                    <img src={`https://s2.coinmarketcap.com/static/img/coins/32x32/${currency.id}.png`} alt="crypto" />
                    <span>{currency.name}</span>
                </div>
            }
            className={styles.card}
        >
            <p>Текущая цена: <strong>{price}$</strong></p>
            <p>
                Изменение цены за 24 часа: 
                {' '}
                <span className={priceChange >= 0 ? styles.greenText : styles.redText}>
                    {Math.abs(priceChange)}%
                </span>
            </p>
            <p>Текущая капитализация: <strong>${capitalization}</strong></p>

        </Card>

    )
}

function formatCapitalization(value) {
    if (value >= 1e12) {
        return (value / 1e12).toFixed(2) + 'T'; 
    } else if (value >= 1e9) {
        return (value / 1e9).toFixed(2) + 'B'; 
    } else if (value >= 1e6) {
        return (value / 1e6).toFixed(2) + 'M'; 
    } else {
        return value.toLocaleString('en-EN'); 
    }
}

CryptoCurrencyCard.propTypes = {
    currency: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quote: PropTypes.shape({
            USD: PropTypes.shape({
                price: PropTypes.number.isRequired,
                percent_change_24h: PropTypes.number.isRequired,
                market_cap: PropTypes.number.isRequired,
            }).isRequired,
        }).isRequired,
    }).isRequired
}


export default CryptoCurrencyCard

