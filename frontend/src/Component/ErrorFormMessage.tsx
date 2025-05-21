type Props = {
    message: string | undefined;
};

export default function ErrorFormMessage({ message }: Props) {
    return <p className="text-red-500 m-2 font-medium text-right">{message ?? ""}</p>;
}
