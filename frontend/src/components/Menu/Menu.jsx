import { Menu } from 'antd'
import PropTypes from 'prop-types'
import styles from './Menu.module.css'

function MyMenu(props) {
    const { currencies, onClick } = props
    
    return (
        <Menu 
            onClick={onClick}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={currencies}
            className={styles.menu}
        />
    )
}

MyMenu.propTypes = {
    currencies: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClick: PropTypes.func.isRequired
}

export default MyMenu
