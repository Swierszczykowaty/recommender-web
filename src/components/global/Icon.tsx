interface Props extends React.HTMLAttributes<HTMLSpanElement> {
    icon: string;
    className?: string;
    variant?: "filled" | "outlined",
}

const Icon = ({ icon, className, variant="outlined", ...props }: Props) => {
    return (
        <span className={`${ variant == "filled" ? "material-symbols-filled" : "material-symbols-outlined" }  ${ className || className }`} { ...props }>{ icon }</span>
    );
}

export default Icon;