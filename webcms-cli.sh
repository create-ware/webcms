#!/bin/sh
webcms_help()
{
  echo "";
  echo "Management options:";
  echo "";
  echo "--build                        Create images, containers and build dependencies";
  echo "--start-development            Create containers and start services";
  echo "--build-production             Build production";
  echo "--start-production             Create containers and start services";
  echo "--restart-development          Restart services";
  echo "--restart-production           Restart services";
  echo "--stop-development             Stop services";
  echo "--stop-production              Stop services";
  echo "--remove-development           Remove containers";
  echo "--install-dependencies         Install dependencies";
  echo "--remove-networks              Remove networks";
  echo "";
  echo "If you want to show some container logs you can run:";
  echo "\$docker logs <container-name> -f --tail 100";
}

webcms_build()
{
  echo "Build";
  base_dir=./docker/;
  mkdir -p ${base_dir}../database/mysql/;
  echo "Build: webcms-node-img";
  docker build -f ${base_dir}/dockerfile/dockerfile-node -t webcms-node-img .;
  docker-compose -f ${base_dir}build/webcms-nodejs-builder.yml run --rm webcms-install;
  echo "Build finished";
  echo "For next steps run: webcms.sh after-deploying";
}

webcms_start_development()
{
  echo "Starting development";
  echo "";
  base_dir=./docker/development/;
  docker-compose -f ${base_dir}docker-compose.yml -p webcms-development up -d;
  echo "";
  echo "Starting development finished";
}

webcms_start_production()
{
  echo "Starting production";
  echo "";
  base_dir=./docker/production/;
  webcms_remove_networks;
  docker stack deploy -c ${base_dir}docker-compose.yml webcms-production;
  echo "";
  echo "Starting production finished";
}

webcms_build_production()
{
  echo "Starting build production";
  echo "";
  base_dir=./docker/production/;
  docker-compose -f ${base_dir}webcms-dashboard-app-production.yml run --rm webcms-install;
  webcms_remove_networks;
  echo "";
  echo "Starting build production finished";
}

webcms_stop_development()
{
  echo "Stopping development";
  echo "";
  base_dir=./docker/development/;
  docker-compose -f ${base_dir}docker-compose.yml -p webcms-development stop;
  echo "";
  echo "Stopping development finished";
}

webcms_stop_production()
{
  echo "Stopping production";
  echo "";
  docker stack rm webcms-production;
  webcms_remove_networks;
  echo "";
  echo "Stopping production finished";
}

webcms_restart_development()
{
  echo "Restarting development";
  echo "";
  base_dir=./docker/development/;
  docker-compose -f ${base_dir}docker-compose.yml -p webcms-development stop;
  docker-compose -f ${base_dir}docker-compose.yml -p webcms-development start;
  echo "";
  echo "Restarting development finished";
}

webcms_restart_production()
{
  echo "Restarting production";
  echo "";
  base_dir=./docker/production/;
  docker stack rm webcms-production
  webcms_remove_networks;
  sleep 4;
  docker stack deploy -c ${base_dir}docker-compose.yml webcms-production;
  echo "";
  echo "Restarting production finished";
}

webcms_remove_development()
{
  echo "Removing development";
  echo "";
  base_dir=./docker/development/;
  docker-compose -f ${base_dir}docker-compose.yml -p webcms-development down;
  echo "";
  echo "Removing development finished";
}

webcms_install_dependencies()
{
  echo "Installing dependencies";
  echo "";
  base_dir=./docker/;
  docker-compose -f ${base_dir}build/webcms-nodejs-builder.yml run --rm webcms-install;
  echo "";
  echo "Installing dependencies finished";
}

webcms_remove_networks()
{
  echo "Removing all networks";
  echo "";
  docker network rm webcms-work-network;
  docker network rm webcms-development_default;
  docker network rm production_default;
  sleep 6;
  echo "";
  echo "Removing all networks finished";
}

echo "== WebCMS ==";
case $1 in
--build)
	webcms_build;
	;;
--start-development)
	webcms_start_development;
	;;
--start-production)
	webcms_start_production;
	;;
--build-production)
  webcms_build_production;
  ;;
--stop-development)
  webcms_stop_development;
	;;
--stop-production)
	webcms_stop_production;
	;;
--restart-development)
  webcms_restart_development;
	;;
--restart-production)
	webcms_restart_production;
	;;
--remove-development)
	webcms_remove_development;
	;;
--install-dependencies)
	webcms_install_dependencies;
  ;;
--remove-networks)
  webcms_remove_networks;
  ;;
--help)
  webcms_help;
  ;;
*)
  webcms_help;
  echo "";
  echo "Version. 1.0.0 beta";
  echo "";
	;;
esac
