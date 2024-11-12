#!/bin/bash


# Fetch EC2 instance details
data=$(aws ec2 describe-instances)

# Extract the Public IP based on the "dev-deploy" tag
ip=$(echo "$data" | jq -r '.Reservations[].Instances[] | select(.Tags[]?.Value == "dev-deploy") | .PublicIpAddress')

if [ -n "$ip" ]; then
    # Output the public IP
    echo "$ip"
else 
    echo "Could not retrieve public IP address. Please verify the instance name and state."
    exit 1
fi
