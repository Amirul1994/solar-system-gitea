echo "Fetching EC2 Public IP for integration testing..."

# Fetch EC2 instance details
data=$(aws ec2 describe-instances)
ip=$(echo "$data" | jq -r '.Reservations[].Instances[] | select(.Tags[]?.Value == "dev-deploy") | .PublicIpAddress')

echo "Public IP - $ip"

if [ -n "$ip" ]; then
    # Proceed with using the IP for your login or testing as needed
    echo "Connecting to EC2 instance at $ip..."
    # Example: ssh or testing commands using $ip
else 
    echo "Could not retrieve public IP address. Please verify the instance name and state."
    exit 1
fi
