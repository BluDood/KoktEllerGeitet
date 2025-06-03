import React from 'react'
import styles from './Layout.module.css'
import { Outlet } from 'react-router'
import Titlebar from '../Titlebar/Titlebar.tsx'

const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Titlebar />
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
