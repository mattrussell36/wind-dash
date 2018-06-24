export default function average(values) {
    const sum = values.reduce((sum, v) => sum += v, 0);
    return sum / values.length; 
}
