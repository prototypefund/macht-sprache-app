import s from './style.module.css';

type Props = {
    title: string;
    children: React.ReactNode;
    sidebar?: React.ReactNode;
};

function Layout({ title, children, sidebar }: Props) {
    return (
        <div className={s.container}>
            <div className={s.sidebar}>
                <div className={s.sidebarInner}>
                    <div className={s.sidebarInnerInner}>
                        <div className={s.logo}>macht.sprache.</div>
                        {sidebar}
                    </div>
                </div>
            </div>
            <main className={s.main}>
                <h1>{title}</h1>
                {children}
            </main>
        </div>
    );
}

export default Layout;
